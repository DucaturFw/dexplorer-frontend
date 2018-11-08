<template lang="pug">
  div(:class='b()' v-if='show')
    b-table(v-if='isArray(dataset)' :class='b("table")' :data='dataset')
      template(slot-scope="props" slot="header")
        span(:class='b("header", props.column.meta)') {{ props.column.label }}
      template(slot-scope="props")
        b-table-column(v-for='col in columns' v-bind='col' :key='col.label+col.field' :class='b("column", col.meta)')
          div(v-if='!isArray(getData(props.row, col.field, col.meta))')
            router-link(v-if='col.meta.url' :to='"/" + selectedChain +  col.meta.url(props.row)')
              component(:is='col.meta.editor' v-bind='col.meta.props' :value='getData(props.row, col.field, col.meta)' :class='b("field", col.meta )')
            component(v-else :is='col.meta.editor' v-bind='col.meta.props' :value='getData(props.row, col.field, col.meta)' :class='b("field", col.meta )')
          div(v-for='l in getData(props.row, col.field, col.meta)' v-else)
            component(:is='col.meta.editor' v-bind='col.meta.props' :value='l' :class='b("field", col.meta )')
    div(:class='b("list")' v-else)
      dl(v-for="(col, index) in columns" :key='index' :class='b("spec")')
        dt(:class='b("spec-term")') {{ col.label }}
        dd(:class='b("spec-desc")')
          div(v-if='!isArray(getData(dataset, col.field, col.meta))')
            router-link(v-if='col.meta.url' :to='"/" + selectedChain +  col.meta.url(dataset)')
              component(:is='col.meta.editor' v-bind='col.meta.props' :value='getData(dataset, col.field, col.meta)' :class='b("field", col.meta )')
            component(v-else :is='col.meta.editor' v-bind='col.meta.props' :value='getData(dataset, col.field, col.meta)' :class='b("field", col.meta )')
          div(v-for='l in getData(dataset, col.field, col.meta)' v-else)
            component(:is='col.meta.editor' v-bind='col.meta.props' :value='l' :class='b("field", col.meta )')
  div(:class='b()' v-else)
    span Reload

</template>

<script lang="ts">
import vue from "vue";
import { Vue, Component, Prop, Watch } from "nuxt-property-decorator";
import { State } from "vuex-class";
import HashVue from "../moleculas/data-table-fields/Hash.vue";
import FromNowVue from "../moleculas/data-table-fields/FromNow.vue";
import DateVue from "../moleculas/data-table-fields/Date.vue";
import TextVue from "../moleculas/data-table-fields/Text.vue";
import ValueVue from "../moleculas/data-table-fields/Value.vue";
import MoneyVue from "../moleculas/data-table-fields/Money.vue";

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
    "dt-value": ValueVue,
    "dt-money": MoneyVue
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

  isArray(raw: any) {
    return Array.isArray(raw);
  }

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
    // white-space: nowrap;

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

  &__spec {
    display: flex;
    padding: 5px 10px;
    border-bottom: 1px solid #dbdbdb;

    &:nth-child(1) {
      border-top: 1px solid #dbdbdb;
    }

    &-term {
      white-space: nowrap;
      margin-right: auto;
    }

    &-desc {
      text-overflow: ellipsis;
      overflow: hidden;
      margin-left: 20px;
    }
  }
}
</style>
