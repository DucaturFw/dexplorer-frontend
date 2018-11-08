<template lang="pug">
  section(:class="b()")
    .tile.is-vertical(v-if='tx')
      .tile
        t-container.tile.is-child.has-background-black-ter.has-text-white-bis(:padding='30')
          h2.is-size-1 
            span Transactions 
            m-hash.is-size-1(:value='tx.hash' :head='0' :tail='0')
            
          //- pre {{ tx }}
        //- t-container.tile.is-child.has-background-primary.has-text-white-bis(:padding='30')
      .tile.has-background-white-ter
        t-container.tile.is-child(:padding='30')
          h3.is-size-3 Core
          o-data-table(:dataset='tx' :schema='details')

        t-container.tile.is-child(:padding='30')
          h3.is-size-3 Ethereum specific
          o-data-table(:dataset='tx' :schema='specific')

      t-container.tile.is-child(:padding='30')
        h3.is-size-3 Events
        o-data-table(:dataset='tx.logs' :schema='events')

      t-container.tile.is-child(:padding='30')
        h3.is-size-3 Trace
        o-data-table(:dataset='tx.trace' :schema='traces')

        //- pre {{ tx }}

</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { ITransaction } from "store";
import ContainerVue from "~/components/templates/Container.vue";
import HashVue from "~/components/moleculas/data-table-fields/Hash.vue";
import DataTableVue from "~/components/organisms/DataTable.vue";
import abi from "ethereumjs-abi";
import bn from "bn.js";

const methods = require("~/plugins/api/4bytes.json");

@Component(<any>{
  name: "l-page",
  components: {
    "m-hash": HashVue,
    "o-data-table": DataTableVue,
    "t-container": ContainerVue
  },
  async asyncData(context) {
    let hash = "";
    let tx: ITransaction | null = null;
    const key = context.route.params.hash;

    if (
      typeof key === "string" &&
      (key.length === 64 || key.startsWith("0x"))
    ) {
      // hash
      hash = key.startsWith("0x") ? key.slice(2) : key;
      tx = await context.app.$connection.getTransaction(hash);
    } else {
      throw new Error("incorrect block identity");
    }

    return {
      tx,
      hash
    };
  }
})
export default class extends Vue {
  $route: any;

  hash: string = "";
  tx: any;

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

  get events() {
    return [
      {
        title: "Type",
        key: "type"
      },
      {
        title: "Raw",
        editor: "hash",
        key: "topics",
        // key: row => "0x" + row.topics.map(t => t.slice(2)).join(""),
        props: {
          tail: 0,
          head: 0
        }
      }
    ];
  }

  get traces() {
    return [
      {
        title: "Type",
        key: "type"
      },
      {
        title: "From",
        editor: "hash",
        key: "from"
      },
      {
        title: "To",
        editor: "hash",
        key: "to"
      },
      {
        title: "Value",
        key: row => this.fromWei(new bn(row.value)) + " ETH"
      },
      {
        title: "Input",
        editor: "hash",
        key: "input",
        props: {
          row: 30,
          head: 0,
          tail: 0
        }
      },
      {
        title: "Parsed",
        key: row => {
          const methodId = (<string>row.input).slice(0, 10);
          const method = methods[methodId];

          if (method) {
            const payload = (<string>row.input).slice(10);
            const methodName = method.split("(")[0];

            const inTypes = method.split(/[(),]+/).slice(1, -1);

            var inDecoded = abi.rawDecode(inTypes, Buffer.from(payload, "hex"));
            // const methodStr =
            //   methodName +
            //   "(" +
            //   inTypes.map((type, i) => printArg(type, inDecoded[i])) +
            //   ")";

            return {
              methodName,
              inTypes,
              inDecoded
            };
          }

          return methodId;
        }
      }
    ];
  }

  get specific() {
    return [
      {
        title: "Gas",
        key: "gas",
        editor: "value"
      },
      {
        title: "Gas used",
        key: "gasUsed",
        editor: "value"
      },
      {
        title: "Gas price (ETH)",
        key: row => this.fromWei(new bn(row.gasPrice)) + " ETH"
      },
      {
        title: "Fee (ETH)",
        key: row =>
          this.fromWei(new bn(row.gasUsed).mul(new bn(row.gasPrice))) + " ETH"
      }
    ];
  }

  get details() {
    return [
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
        title: "From",
        key: "from",
        editor: "hash",
        props: {
          head: 2,
          tail: 4
        },
        width: 120,
        url: row => `/identity/${row.from}`
      },
      {
        title: "Value",
        key: row => this.fromWei(row.value) + " ETH"
      },
      {
        title: "To",
        key: "to",
        editor: "hash",
        props: {
          head: 2,
          tail: 4
        },
        width: 120,
        url: row => `/identity/${row.to}`
      },
      {
        title: "Block #",
        key: "blockHeight",
        url: row => `/block/${row.blockHeight}`
      }
    ];
  }
}
</script>