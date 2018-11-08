import vue from "vue";
import bn from "bn.js";
import * as rx from "rxjs";
import axios, { AxiosPromise } from "axios";
import { IBlock } from "~/store";

export default function(context, inject) {
  if (!context.isHMR) {
    context.app.$connection = new DuxiConnection();
    vue.prototype.$connection = context.app.$connection;

    if ((<any>process).client) {
      context.app.$connection.loop();
    }
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
  return proxy
    .post(url, {
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1
    })
    .then(r => r.data.result);
}

function ethrpc(method, params) {
  return jsonrpc("http://95.216.68.220:8545", method, params);
}
function eosrpc(method, params) {
  return proxy
    .post("http://95.216.68.220:8888/v1/" + method, params)
    .then(r => r.data);
}
function cmc(id) {
  return proxy
    .get("https://api.coinmarketcap.com/v2/ticker/" + id)
    .then(r => r.data);
}

function ethNum(raw) {
  return new bn(raw.slice(2), 16).toNumber();
}

async function cmcMarket(id) {
  const response = await cmc(id);
  try {
    return {
      price: response.data.quotes.USD.price,
      cap: response.data.quotes.USD.market_cap
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
              ])
            )
        );
        return blocks;
      }
    },
    eth: {
      async getHeight() {
        const result = await ethrpc("eth_blockNumber", []);
        return new bn((result as string).slice(2), 16).toNumber();
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
              ]).then(result => ({
                ...result,
                height: ethNum(result.number),
                timestamp: ethNum(result.timestamp),
                size: ethNum(result.size),
                gasUsed: ethNum(result.gasUsed),
                gasLimit: ethNum(result.gasLimit)
              }))
            )
        );
        return blocks;
      }
    },
    eos: {
      async getHeight() {
        const response = await eosrpc("chain/get_info", null);
        return response.head_block_num;
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
                .then(response => response)
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

  getBlockByHash(hash: string, transactions: boolean = false) {
    return ethrpc("eth_getBlockByHash", ["0x" + hash, transactions]).then(
      block => ({
        ...block,
        height: ethNum(block.number),
        timestamp: ethNum(block.timestamp),
        size: ethNum(block.size),
        gasUsed: ethNum(block.gasUsed),
        gasLimit: ethNum(block.gasLimit)
      })
    );
  }

  getBlockByHeight(height: number, transactions: boolean = false) {
    return ethrpc("eth_getBlockByNumber", [
      "0x" + new bn(height).toString("hex"),
      transactions
    ]).then(block => ({
      ...block,
      height: ethNum(block.number),
      timestamp: ethNum(block.timestamp),
      size: ethNum(block.size),
      gasUsed: ethNum(block.gasUsed),
      gasLimit: ethNum(block.gasLimit)
    }));
  }

  async getTransaction(hash: string) {
    let [tx, receipt, trace] = await Promise.all([
      ethrpc("eth_getTransactionByHash", ["0x" + hash]),
      ethrpc("eth_getTransactionReceipt", ["0x" + hash]),
      ethrpc("trace_transaction", ["0x" + hash])
    ]);

    let block = await this.getBlockByHash(tx.blockHash.slice(2));

    const getInput = (r: any): string => {
      switch (r.type) {
        case "call":
          return r.action.input;
        case "create":
          return r.action.init;
        case "suicide":
          return "0x0";
      }
      throw new Error(`unknown trace type ${r.type}`);
    };
    const getTo = (r: any, tx?: any): string[] => {
      switch (r.type) {
        case "call":
          return [r.action.to];
        case "suicide":
          return [r.action.refundAddress];
        case "create":
          return ["0x0"];
      }
      throw new Error(`unknown trace type ${r.type}`);
    };
    const getFrom = (r: any): string[] => {
      switch (r.type) {
        case "call":
        case "create":
          return [r.action.from];
        case "suicide":
          return [r.action.address];
      }
      throw new Error(`unknown trace type ${r.type}`);
    };
    const getValue = (r: any): string => {
      try {
        return new bn(r.action.value.slice(2), "hex").toString(10);
      } catch (e) {
        return "0";
      }
    };

    trace = trace.map(r => ({
      raw: {
        ...r,
        block: null
      },
      meta: {},
      version: 2,
      from: getFrom(r),
      to: getTo(r),
      input: getInput(r),
      timestamp: block.timestamp,
      result: r.result || {},
      type: r.type,
      txHash: r.transactionHash,
      trace: r.traceAddress,
      parsed: {},
      id: r.transactionHash + r.traceAddress,
      blockHash: block.hash,
      blockHeight: block.height,
      value: getValue(r)
    }));

    const raw = {
      ...tx,
      ...receipt,
      trace
    };

    raw.value = new bn(raw.value.slice(2), 16).toString(10);
    raw.nonce = new bn(raw.nonce.slice(2), 16).toString(10);
    raw.gas = new bn(raw.gas.slice(2), 16).toString(10);
    raw.gasPrice = new bn(raw.gasPrice.slice(2), 16).toString(10);
    raw.gasUsed = new bn(raw.gasUsed.slice(2), 16).toString(10);
    raw.cumulativeGasUsed = new bn(raw.cumulativeGasUsed.slice(2), 16).toString(
      10
    );
    raw.txIndex = new bn(raw.transactionIndex.slice(2), 16).toString(10);
    raw.blockHeight = new bn(raw.blockNumber.slice(2), 16).toString(10);

    delete raw.transactionIndex;
    delete raw.blockNumber;

    return {
      ...raw
    };
  }

  async loop(force?: true) {
    if (!force) {
      await new Promise(resolve => setTimeout(resolve, 500));
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
    this.height.next(0);
    this.chain = chain;
    this.reject = true;
    this.renewBlocks = true;
  }
}
