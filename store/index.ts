export type Address = string;
export type Hash = string;
export type StringNumber = string;
export type HexNumber = string;
export type Binary = string;

export type ChainCode = "eth" | "btc" | "neo" | "eos" | "cardano";

export interface IMeta {
  version: number;
  meta?: any;
}

export interface ILog extends IMeta {
  id: string;
  involved: Address[];
  blockHash: Hash;
  blockHeight: number;
  txHash: Hash;
  txIndex: number;
  logIndex: number;
  data: Binary;
  type: string;
  parsedVersion?: number;
  parsed?: any;
}

export interface IBlock extends IMeta {
  hash: Hash;
  parentHash: Hash;
  height: number;
  signature: Binary;
  timestamp: number;
  author: Address;
  transactionsRoot: Hash;
  transactions: Array<Hash>;
}

export interface ITransaction extends IMeta {
  txHash: Hash;
  blockHash: Hash;
  blockHeight: number;
  txIndex: number;
  signature: Binary;
  input: Binary;
  from: Address[];
  to: Address[];
  timestamp: number;
}

export interface ITrace extends IMeta {
  type: string;
  txHash: Hash;
  blockHash: Hash;
  blockHeight: number;
  from: Address[];
  to: Address[];
  input: Binary;
  trace: number[];
  timestamp: number;
  parsed: any;
}

export interface IChainConfig {
  name: string;
  ticker: string;
  code: ChainCode;
  icon: string;
}

export interface IStoreState {
  now: number;

  chains: Array<IChainConfig>;
  selectedChain: ChainCode;

  // blocks
  chainHeight: number;
  latestBlocks: IBlock[];

  //tps
  currentTPS: number;
  historyTPS: number[];
  maxTPS: number;

  price: number;
  historyPrices: number[];
  marketCap: number;
  historyMarketCap: number[];

  mempoolSize: number;
  mempoolSizeHistory: number;
}

export const state = (): Nullable<IStoreState> => {
  const chains: Array<IChainConfig> = [
    {
      name: "Ethereum",
      ticker: "ETH",
      code: "eth",
      icon: "https://static.coincap.io/assets/icons/eth@2x.png"
    },
    {
      name: "EOSIO",
      ticker: "EOS",
      code: "eos",
      icon: "https://static.coincap.io/assets/icons/eos@2x.png"
    },
    {
      name: "Bitcoin",
      ticker: "BTC",
      code: "btc",
      icon: "https://static.coincap.io/assets/icons/btc@2x.png"
    },
    {
      name: "Neo",
      ticker: "NEO",
      code: "neo",
      icon: "https://static.coincap.io/assets/icons/neo@2x.png"
    }
  ];
  return {
    now: 0,
    chains,
    selectedChain: null,

    chainHeight: null,
    latestBlocks: null,

    currentTPS: null,
    historyTPS: null,
    maxTPS: null,

    price: null,
    historyPrices: null,
    marketCap: null,
    historyMarketCap: null,

    mempoolSize: null,
    mempoolSizeHistory: null
  };
};

export type StateMutation<T> = (state: IStoreState, v: T) => void;
export type CommitMutation<T> = (v: T) => void;
export type Nullable<T> = { [P in keyof T]: T[P] | null };

export class mutations {
  static selectedChain(state: Nullable<IStoreState>, chain: ChainCode) {
    state.selectedChain = chain;
  }

  static now(state: Nullable<IStoreState>, now: number) {
    state.now = now;
  }

  static marketCap(state: Nullable<IStoreState>, marketCap: number) {
    state.marketCap = marketCap;
  }

  static price(state: Nullable<IStoreState>, price: number) {
    state.price = price;
  }

  static chainHeight(state: Nullable<IStoreState>, chainHeight: number) {
    state.chainHeight = chainHeight;
  }

  static async recentBlockReceive(state: Nullable<IStoreState>, block: IBlock) {
    if (state.latestBlocks == null) {
      state.latestBlocks = [];
    }

    state.latestBlocks.push(block);
    while (state.latestBlocks.length > 10) {
      state.latestBlocks.shift();
    }

    state.latestBlocks = state.latestBlocks;
  }

  static resetChain(state: Nullable<IStoreState>) {
    state.chainHeight = null;
    state.latestBlocks = null;

    //tps
    state.currentTPS = null;
    state.historyTPS = null;
    state.maxTPS = null;

    state.price = null;
    state.historyPrices = null;
    state.marketCap = null;
    state.historyMarketCap = null;

    state.mempoolSize = null;
    state.mempoolSizeHistory = null;
  }
}

export class actions {
  static async marketCap({ commit }, marketCap) {
    commit("marketCap", marketCap);
  }
  static async price({ commit }, price) {
    commit("price", price);
  }
  static async chainHeight({ commit }, height) {
    commit("chainHeight", height);
  }
  static async selectedChain({ commit }, chain) {
    commit("resetChain");
    commit("selectedChain", chain);
  }

  static async recentBlockReceive({ commit }, block) {
    commit("recentBlockReceive", block);
  }
  static async nuxtServerInit({ commit }, { app }) {
    const people = await app.$axios.$get("./random-data.json");
    commit("setPeople", people.slice(0, 10));
  }
}
