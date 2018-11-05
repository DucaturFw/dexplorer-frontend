<template lang="pug">
  div(:class='b()' v-if='show')
    b-table(:class='b("table")' :data='dataset')
      <template slot-scope="props" slot="header">
        span(:class='b("header", props.column.meta)') {{ props.column.label }}
        
        //- <b-tooltip :active="!!props.column.meta" :label="props.column.meta" dashed>
        //-     {{ props.column.label }}
        //- </b-tooltip>
      </template>
      template(slot-scope="props")
        b-table-column(v-for='col in columns' v-bind='col' :key='col.label+col.field' :class='b("column", col.meta)')
          router-link(v-if='col.meta.url' :to='"/" + selectedChain +  col.meta.url(props.row)')
            component(:is='col.meta.editor' v-bind='col.meta.props' :value='getData(props.row, col.field, col.meta)' :class='b("field", col.meta )')
          component(v-else :is='col.meta.editor' v-bind='col.meta.props' :value='getData(props.row, col.field, col.meta)' :class='b("field", col.meta )')
  div(:class='b()' v-else)
    span Reload

</template>

<script lang="ts">
import vue from "vue";
import { Vue, Component, Prop, Watch } from "nuxt-property-decorator";
import HashVue from "../moleculas/data-table-fields/Hash.vue";
import FromNowVue from "../moleculas/data-table-fields/FromNow.vue";
import DateVue from "../moleculas/data-table-fields/Date.vue";
import TextVue from "../moleculas/data-table-fields/Text.vue";
import ValueVue from "../moleculas/data-table-fields/Value.vue";
import { State } from "vuex-class";

export interface ITableColumn {
  title: string;
  key: string | ((row: any) => any);
  show: boolean;
  editor?: string;
  props?: any;
  width?: number;
  hideMobile?: true;
  custom?: true;
  url?: ((row: any) => any);
}

@Component({
  name: "o-data-table",
  components: {
    "dt-hash": HashVue,
    "dt-fromNow": FromNowVue,
    "dt-date": DateVue,
    "dt-text": TextVue,
    "dt-value": ValueVue
  },
  watch: {
    schema: function(v) {
      this.show = false;
      this.$nextTick(() => (this.show = true));
    }
  }
})
export default class extends Vue {
  @State selectedChain: string;

  @Prop({ required: true })
  schema: ITableColumn[];

  @Prop() dataset: any[];

  show = true;

  getData(from: any, key: string, meta: { func: (row: any) => any }) {
    if (key === "meta.function") {
      return meta.func(from);
    } else {
      return from[key];
    }
  }

  get columns() {
    return this.schema.map(col => ({
      field: typeof col.key === "function" ? "meta.function" : col.key,
      label: col.title,
      width: col.width || 250,
      meta: {
        col: col,
        url: col.url,
        "hide-mobile": col.hideMobile,
        func: typeof col.key === "function" ? col.key : false,
        custom: col.custom,
        editor: `dt-${col.editor || "text"}`,
        props: col.props
      }
    }));
  }
}
</script>


<style lang="scss">
.o-data-table {
  .table-wrapper {
    // table {
    //   table-layout: fixed
    // }
    overflow: scroll;
  }

  &__header {
    white-space: nowrap;
    flex-grow: 1;
    display: block;
    padding: 0.5em 0.75em;
    margin: -0.5em -0.75em;
  }
  &__column {
    white-space: nowrap;

    &--hide-mobile {
      @media screen and (max-width: 768px) {
        display: none !important;
      }
    }
  }

  &__column,
  &__header {
    &--custom {
      background-color: rgba(41, 125, 251, 0.05);
    }
  }
}
</style>
