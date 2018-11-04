import bn from "bn.js";
import * as rx from "rxjs";
import axios, { AxiosPromise } from "axios";
import { IBlock } from "~/store";

export default function(context, inject) {
  if ((<any>process).client && !context.isHMR) {
    inject("connection", new DuxiConnection());
  }
}

export type ChainCode = "eth" | "btc" | "neo" | "eos" | "cardano";

export interface IProvider {
  getHeight(): Promise<number>;
  getMarket(): Promise<{ price: number; cap: number }>;
  getBlocks(to: number, limit: number): Promise<IBlock[]>;
}

const proxy = {
  post<T = any>(url, data): AxiosPromise<T> {
    const uri = new URL(url);
    const instance = axios.create({
      headers: {
        "Target-URL": uri.origin
      }
    });
    return instance.post("http://localhost:4000" + uri.pathname, data);
  },
  get<T = any>(url): AxiosPromise<T> {
    const uri = new URL(url);
    const instance = axios.create({
      headers: {
        "Target-URL": uri.origin
      }
    });
    return instance.get("http://localhost:4000" + uri.pathname);
  }
};

function jsonrpc(url, method, params) {
  return proxy.post(url, {
    jsonrpc: "2.0",
    method: method,
    params: params,
    id: 1
  });
}

function ethrpc(method, params) {
  return jsonrpc("http://95.216.68.220:8545", method, params);
}
function eosrpc(method, params) {
  return proxy.post("http://95.216.68.220:8888/v1/" + method, params);
}
function cmc(id) {
  return proxy.get("https://api.coinmarketcap.com/v2/ticker/" + id);
}

async function cmcMarket(id) {
  const response = await cmc(id);
  try {
    return {
      price: response.data.data.quotes.USD.price,
      cap: response.data.data.quotes.USD.market_cap
    };
  } catch (e) {
    console.error(e);
    return {
      price: 0,
      cap: 0
    };
  }
}

export class DuxiConnection {
  providers: {
    [key: string]: IProvider;
  } = {
    btc: {
      async getHeight() {
        return 0;
      },
      async getMarket() {
        return await cmcMarket(1);
      },
      async getBlocks(to: number, limit: number) {
        const blocks: IBlock[] = await Promise.all(
          Array(limit)
            .fill(0)
            .map((_, index) => to - index)
            .map(height =>
              ethrpc("eth_getBlockByNumber", [
                "0x" + new bn(height).toString("hex"),
                true
              ]).then(response => response.data.result)
            )
        );
        return blocks;
      }
    },
    eth: {
      async getHeight() {
        const response = await ethrpc("eth_blockNumber", []);
        return new bn((response.data.result as string).slice(2), 16).toNumber();
      },
      async getMarket() {
        return await cmcMarket(1027);
      },
      async getBlocks(to: number, limit: number) {
        const blocks: IBlock[] = await Promise.all(
          Array(limit)
            .fill(0)
            .map((_, index) => to - limit + index + 1)
            .map(height =>
              ethrpc("eth_getBlockByNumber", [
                "0x" + new bn(height).toString("hex"),
                true
              ]).then(response => ({
                ...response.data.result,
                height: new bn(
                  response.data.result.number.slice(2),
                  16
                ).toNumber(),
                timestamp: new bn(
                  response.data.result.timestamp.slice(2),
                  16
                ).toNumber()
              }))
            )
        );
        return blocks;
      }
    },
    eos: {
      async getHeight() {
        const response = await eosrpc("chain/get_info", null);
        return response.data.head_block_num;
      },
      async getMarket() {
        return await cmcMarket(1765);
      },
      async getBlocks(to: number, limit: number) {
        const blocks: IBlock[] = await Promise.all(
          Array(limit)
            .fill(0)
            .map((_, index) => to - limit + index)
            .map(height =>
              eosrpc("chain/get_block", {
                block_num_or_id: height
              })
                .then(response => response.data)
                .then(block => ({
                  version: 1,

                  author: block.block.producer,
                  hash: block.block_id,
                  height: block.block_num,
                  parentHash: block.block.previous,
                  timestamp: block.createdAt.getTime() / 1000,
                  signature: block.block.producer_signature,
                  transactions: block.block.transactions.map(tx => tx.trx.id),
                  transactionsRoot: block.block.transaction_mroot
                }))
            )
        );
        return blocks;
      }
    }
  };

  chain: ChainCode | null = null;
  height: rx.BehaviorSubject<number> = new rx.BehaviorSubject<number>(0);
  price: rx.BehaviorSubject<number> = new rx.BehaviorSubject<number>(0);
  mempool: rx.BehaviorSubject<number> = new rx.BehaviorSubject<number>(0);
  cap: rx.BehaviorSubject<number> = new rx.BehaviorSubject<number>(0);
  tps: rx.BehaviorSubject<number> = new rx.BehaviorSubject<number>(0);
  blocks: rx.ReplaySubject<IBlock> = new rx.ReplaySubject<IBlock>(10);

  renewBlocks: boolean = true;
  reject: boolean = false;

  tick: number = 0;

  constructor() {
    this.loop();
  }

  async loop(force?: true) {
    if (!force) {
      return setTimeout(() => this.loop(true), 500);
    }
    console.log(`Loop ${this.tick++}`);
    if (this.chain !== null) {
      const height = await this.providers[this.chain].getHeight();

      if (this.height.value < height) {
        const market = await this.providers[this.chain].getMarket();
        const blocks = await this.providers[this.chain].getBlocks(
          height,
          this.renewBlocks ? 10 : 1
        );

        if (this.reject) {
          this.reject = false;
        } else {
          this.renewBlocks = false;
          blocks.forEach(block => this.blocks.next(block));
          this.height.next(height);
          this.cap.next(market.cap);
          this.price.next(market.price);
        }
      }
    }

    this.loop();
  }

  watch(chain: ChainCode) {
    console.log(`Watch ${chain} network`);
    this.height.next(0);
    this.chain = chain;
    this.reject = true;
    this.renewBlocks = true;
  }
}
