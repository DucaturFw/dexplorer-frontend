<template lang="pug">
  section(:class="b()")
    .tile.is-vertical(v-if='block')
      .tile
        t-container.tile.is-child.has-background-black-ter.has-text-white-bis(:padding='30')
          h2.is-size-1 Block \#{{ block.height}}
          m-hash.is-size-1(:value='block.hash' :head='0' :tail='0')
            
        t-container.tile.is-child.has-background-primary.has-text-white-bis(:padding='30')
      .tile.has-background-white-ter
        t-container.tile.is-child(:padding='30')
          h3.is-size-3 Core
          o-data-table(:dataset='block' :schema='details')

        t-container.tile.is-child(:padding='30')
          h3.is-size-3 Ethereum specific
          o-data-table(:dataset='block' :schema='specific')

      t-container.tile.is-child(:padding='30')
        h3.is-size-3 Transactions

        o-data-table(:dataset='block.transactions' :schema='showTx')
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { setTimeout } from "timers";
import { IBlock } from "store";

import ContainerVue from "~/components/templates/Container.vue";
import HashVue from "~/components/moleculas/data-table-fields/Hash.vue";
import DataTableVue from "~/components/organisms/DataTable.vue";

import bn from "bn.js";

@Component(<any>{
  name: "l-page",
  components: {
    "t-container": ContainerVue,
    "o-data-table": DataTableVue,
    "m-hash": HashVue
  },
  async asyncData(context) {
    let hash = "";
    let height = -1;
    let block: IBlock | null = null;
    const key = context.route.params.key;

    if (
      typeof key === "string" &&
      (key.length === 64 || key.startsWith("0x"))
    ) {
      // hash
      hash = key.startsWith("0x") ? key.slice(2) : key;
      block = await context.app.$connection.getBlockByHash(hash, true);
    } else if (/^\d+$/.test(key)) {
      height = parseInt(key);
      block = await context.app.$connection.getBlockByHeight(height, true);
    } else {
      throw new Error("incorrect block identity");
    }

    return {
      block,
      hash,
      height,
      test: "foo"
    };
  }
})
export default class extends Vue {
  $route: any;

  hash: string = "";
  height: number = -1;
  block: IBlock | null = null;
  test: string = "bar";

  mounted() {}

  getByKey(from: any, key: string | ((row: any) => any)) {
    if (typeof key === "function") {
      return key(from);
    } else {
      return from[key];
    }
  }

  get isHash() {
    return this.hash.length === 64;
  }

  get isHeight() {
    return this.height > 0;
  }

  get details() {
    return [
      {
        title: "Height",
        key: "height",
        editor: "value",
        width: 100
      },
      {
        title: "Hash",
        key: "hash",
        editor: "hash",
        props: {
          head: 2,
          tail: 4
        },
        width: 120
      },
      {
        title: "Author",
        key: "author",
        editor: "hash",
        props: {
          head: 2,
          tail: 4
        },
        width: 120
      },
      {
        title: "Time",
        key: "timestamp",
        editor: "date",
        props: {
          format: "DD MMM GGGG HH:mm:ss"
        },
        width: 180
      },
      {
        title: "Age",
        key: "timestamp",
        editor: "fromNow",
        width: 65
      },
      {
        title: "Tx Count",
        key: row =>
          Array.isArray(row.transactions) ? row.transactions.length : 0,
        width: 65
      },
      {
        title: "Size",
        key: "size",
        width: 200,
        show: false
      }
    ];
  }

  get specific() {
    return [
      {
        title: "Gas Used",
        key: "gasUsed",
        editor: "value",
        custom: true
      },
      {
        title: "Gas Limit",
        key: "gasLimit",
        editor: "value",
        custom: true
      },
      {
        title: "Log (map)",
        key: "logsBloom",
        editor: "hash",
        custom: true,
        hideMobile: true,
        props: {
          head: 0,
          tail: 0
        }
      }
    ];
  }

  fromWei(a) {
    return (
      Array(18)
        .fill(0)
        .join("") + a
    )
      .replace(/^(\d*)(\d{18})$/, "$1.$2")
      .replace(/^0*/, "")
      .replace(/0*$/, "")
      .replace(/^\./, "0.")
      .replace(/\.$/, "");
  }

  get showTx() {
    return [
      {
        title: "Hash",
        key: "hash",
        editor: "hash",
        url: row => `/tx/${row.hash}`
      },
      {
        title: "Value",
        key: row =>
          this.fromWei(new bn(row.value.slice(2), 16).toString(10)) + " ETH"
      },
      {
        title: "From",
        key: "from",
        editor: "hash",
        props: {
          head: 2,
          tail: 4
        }
      },
      {
        title: "To",
        key: "to",
        editor: "hash",
        props: {
          head: 2,
          tail: 4
        }
      },
      {
        title: "Fee",
        key: row =>
          this.fromWei(
            new bn(row.gas.slice(2), 16)
              .mul(new bn(row.gasPrice.slice(2), 16))
              .toString(10)
          ) + " ETH"
      }
    ];
  }
}
</script>

<style lang="scss">
.l-page {
}
</style>

