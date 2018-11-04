<template lang="pug">
  section(:class="b()")
    div(v-if='latestBlocks && latestBlocks.length')
      o-data-table(:dataset='latestBlocks' :schema='columns')
      //- b-table(:data='latestBlocks' :columns='columns')
      pre {{ latestBlocks[0] }}
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { IBlock } from "store";
import DataTableVue from "~/components/organisms/DataTable.vue";

@Component({
  components: {
    "o-data-table": DataTableVue
  }
})
export default class extends Vue {
  @State latestBlocks: IBlock[];

  columns = [
    {
      title: "Height",
      key: "height"
    },
    {
      title: "Hash",
      key: "hash",
      editor: "hash"
    },
    {
      title: "Time",
      key: "timestamp",
      editor: "date",
      props: {
        format: "DD MMM 'GG HH:mm:ss"
      }
    },
    {
      title: "Age",
      key: "timestamp",
      editor: "fromNow"
    },
    {
      title: "Tx Count",
      key: row => row.transactions.length
    }
  ];
}
</script>
<style scoped>
</style>