<template lang="pug">
  section(:class="b()")
    div(v-if='latestBlocks && latestBlocks.length')
      o-data-table(:dataset='latestBlocks' :schema='showColumns')
      //- b-table(:data='latestBlocks' :columns='columns')

      b-field(v-for='(col, index) in columns')
        b-checkbox(:value="col.show" @input='flag => toggleShow(index, flag)') {{ col.title }}

      //- b-field(v-for='col in defaultColumns')
        b-checkbox(v-model="col.show") {{ col.title }}


      //- b-field(v-for='col in customColumns')
        b-checkbox(v-model="col.show") {{ col.title }}
      pre {{ latestBlocks[0] }}
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { IBlock, ChainCode } from "store";
import DataTableVue, {
  ITableColumn
} from "~/components/organisms/DataTable.vue";

@Component({
  name: "l-page",
  components: {
    "o-data-table": DataTableVue
  }
})
export default class extends Vue {
  @State selectedChain: ChainCode;
  @State latestBlocks: IBlock[];

  modificators = {
    type: "index"
  };

  columns: Array<ITableColumn> = ([
    {
      title: "Height",
      key: "height",
      editor: "value",
      width: 100,
      url: row => `/block/${row.height}`
    },
    {
      title: "Hash",
      key: "hash",
      editor: "hash",
      props: {
        head: 2,
        tail: 4
      },
      url: row => `/block/${row.hash}`,
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
      key: row => row.transactions.length,
      width: 65
    },
    {
      title: "Size",
      key: "size",
      width: 200,
      show: false
    },
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
      },
      show: false
    },
    {
      title: "Log (raw)",
      key: "logsBloom",
      hideMobile: true,
      custom: true,
      show: false
    }
  ] as Array<Partial<ITableColumn>>).map(
    c => (
      (c.show = typeof c.show === "undefined" ? true : c.show), <ITableColumn>c
    )
  );

  get showColumns() {
    return this.columns.filter(col => col.show);
  }

  get defaultColumns() {
    return this.columns.filter(col => !col.custom);
  }

  get customColumns() {
    return this.columns.filter(col => col.custom);
  }

  toggleShow(index, flag) {
    const updated = {
      ...this.columns[index],
      show: flag
    };
    this.$set(this.columns, index, updated);
  }
}
</script>
<style scoped>
</style>