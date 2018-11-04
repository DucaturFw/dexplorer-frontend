<template lang="pug">
  b-table(:class='b()' :data='dataset')
    template(slot-scope="props")
      b-table-column(v-for='col in columns' v-bind='col' :key='col.label+col.field')
        component(:is='col.editor' v-bind='col.props' :value='getData(props.row, col.field)')

</template>

<script lang="ts">
import vue from "vue";
import { Vue, Component, Prop, Watch } from "nuxt-property-decorator";
import HashVue from "../moleculas/data-table-fields/Hash.vue";
import FromNowVue from "../moleculas/data-table-fields/FromNow.vue";
import DateVue from "../moleculas/data-table-fields/Date.vue";
import TextVue from "../moleculas/data-table-fields/Text.vue";

export interface ITableColumn {
  title: string;
  key: string | ((row: any) => any);
  editor?: string;
  props?: any;
  width?: number;
  hide?: true;
}

@Component({
  name: "o-data-table",
  components: {
    "dt-hash": HashVue,
    "dt-fromNow": FromNowVue,
    "dt-date": DateVue,
    "dt-text": TextVue
  }
})
export default class extends Vue {
  @Prop({ required: true })
  schema: ITableColumn[];

  @Prop() dataset: any[];

  getData(from: any, key: string | ((row: any) => any)) {
    if (typeof key === "function") {
      return key(from);
    } else {
      return from[key];
    }
  }

  get columnsTotalWidth() {
    return this.schema
      .filter(col => typeof col.width === "number" && col.width > 0)
      .reduce((total, col) => ((total += col.width!), total), 0);
  }

  get columns() {
    return this.schema.filter(col => !col.hide).map(col => ({
      field: col.key,
      label: col.title,
      editor: `dt-${col.editor || "text"}`,
      props: col.props
      // width: this.totalWidth * (col.width / this.columnsTotalWidth)
    }));
  }
}
</script>


<style lang="scss">
.o-data-table {
}
</style>
