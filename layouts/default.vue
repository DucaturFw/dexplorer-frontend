<template lang="pug">
  section(:class="b()")
    no-ssr
      duxi-connection
    link(rel="stylesheet" href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css")
    link(rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Montserrat:700&amp;subset=cyrillic")
    t-header.has-background-dark.has-text-white-bis(:class="b('header')")
      router-link(to='/')
        m-logotype(:class="b('logotype')")
      o-chain-select(v-if='chains && chains.length && selectedChain' :chains='chains' :value='selectedChain' @input='onSelectedChain' :class="b('chains')")
      o-menu(:class="b('menu')")
      o-search
      o-flex(direction='row' :wrap='true' slot="under" align='center')
        .card.o-flex__item.o-flex__item--grow
          no-ssr
            line-chart(:data='tpsChartData' :options='tpsChartOptions' style='position: absolute; left: 0; top: 0; bottom: 0; right: 0;z-index: 1')
          .card-content(style="z-index: 2; position: relative")
            p.title
              m-value(:value='tps' :decimals='2')
            p.subtitle Tx/sec
        .card.o-flex__item.o-flex__item--grow
          .card-content
            p.title 
              m-value(:value='chainHeight')
            p.subtitle head block
        .card.o-flex__item.o-flex__item--grow
          no-ssr
            line-chart(:data='tpsChartData' :options='tpsChartOptions' style='position: absolute; left: 0; top: 0; bottom: 0; right: 0;z-index: 1')
          .card-content(style="z-index: 2; position: relative")
            p.title
              m-money(prefix='$' :decimals='2' :value='price')
            p.subtitle avg. price
        .card.o-flex__item.o-flex__item--grow
          no-ssr
            line-chart(:data='tpsChartData' :options='tpsChartOptions' style='position: absolute; left: 0; top: 0; bottom: 0; right: 0;z-index: 1')
          .card-content(style="z-index: 2; position: relative")
            p.title 
              m-value(:value='mempool')
            p.subtitle mempool size
        .card.o-flex__item.o-flex__item--grow
          .card-content
            p.title
              m-money(prefix='$' suffix=' MM' :decimals='2' delimiter=',' :value='marketCapMln')
            p.subtitle market cap
        div(style="padding: 20px")
          a.button.is-large.is-rounded.is-icon.is-success.is-inverted.is-outlined
            span.icon.is-medium
              i.mdi.mdi-plus  
          //- footer.card-footer
            p.card-footer-item
              span view on 
              span
                a(href='https://twitter.com/codinghorror/status/506010907021828096') Twitter
            p.card-footer-item
              span Share on
              a(href='#') Facebook
    t-content
      nuxt
    t-footer
</template>


<script lang="ts">
import DuxiConnection from "~/components/templates/DuxiConnection.vue";
import Header from "~/components/templates/Header.vue";
import Content from "~/components/templates/Content.vue";
import Footer from "~/components/templates/Footer.vue";
import Logotype from "~/components/moleculas/Logotype.vue";
import ChainSelect from "~/components/organisms/ChainSelect.vue";
import Menu from "~/components/organisms/Menu.vue";
import Search from "~/components/organisms/Search.vue";
import Flex from "~/components/organisms/Flex.vue";
import LineChart from "~/components/organisms/LineChart.vue";
import MoneyVue from "~/components/moleculas/data-table-fields/Money.vue";
import ValueVue from "~/components/moleculas/data-table-fields/Value.vue";
import { Component, Vue, Watch } from "nuxt-property-decorator";
import { Mutation, State, Action } from "vuex-class";
import {
  StateMutation,
  CommitMutation,
  IChainConfig,
  ChainCode,
  IBlock
} from "~/store";
import { setInterval } from "timers";

@Component({
  name: "default-layout",
  components: {
    "duxi-connection": DuxiConnection,
    "t-header": Header,
    "t-content": Content,
    "t-footer": Footer,
    "o-menu": Menu,
    "o-search": Search,
    "o-flex": Flex,
    "o-chain-select": ChainSelect,
    "m-logotype": Logotype,
    "m-money": MoneyVue,
    "m-value": ValueVue
  }
  // watch: {
  //   chainHeight() {

  //   }
  // }
})
export default class extends Vue {
  @State chains: Array<IChainConfig>;
  @State selectedChain: ChainCode;
  @State chainHeight: number;
  @State price: number;
  @State marketCap: number;
  @State latestBlocks: IBlock[];
  @State now: number;

  mempool: number = Math.floor(Math.random() * 4300);

  @Action("selectedChain") onSelectedChain: CommitMutation<ChainCode>;

  get marketCapMln() {
    return this.marketCap / 1e6;
  }

  mounted() {
    setInterval(this.updateMemPool.bind(this), 250);
  }

  updateMemPool() {
    this.mempool = Math.max(
      0,
      this.mempool + (-100 + Math.floor(Math.random() * 200))
    );
  }

  get tps() {
    if (!Array.isArray(this.latestBlocks) || !this.latestBlocks.length) {
      return 0;
    }
    const txCount = this.latestBlocks.reduce(
      (acc, block) => ((acc += block.transactions.length), acc),
      0
    );
    const from = this.latestBlocks[0].timestamp * 1000;
    const distance = this.now - from;

    return txCount / distance * 1000;
  }

  get tpsChartData() {
    return {
      labels: Array(7 * 12).fill(0),
      datasets: [
        {
          label: "Transactions",
          backgroundColor: "rgba(41, 125, 251, 0.15)",
          borderColor: "rgba(41, 125, 251, 0.15)",
          pointRadius: 0,
          cubicInterpolationMode: "monotone",
          borderWidth: 0.1,
          data: Array(7 * 12)
            .fill(0)
            .map((_, index) => Math.floor(index + Math.random() * 50))
        }
      ]
    };
  }

  tpsChartOptions = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          display: false
        }
      ],
      yAxes: [
        {
          ticks: {
            min: 0
          },
          display: false
        }
      ]
    },
    pointRadius: 0
  };
}
</script>


<style lang="scss">
.default-layout {
  &__logotype {
    margin-right: 20px;
  }

  &__chains {
    width: 235px;
  }
  &__menu {
    margin-left: auto;
    margin-right: 20px;

    .o-menu__link {
      color: rgba(255, 255, 255, 0.8);

      &.active,
      &:hover {
        color: white;
      }
    }
  }

  &__header {
    .card {
      margin: 5px;
      flex-grow: 1;

      .title {
        white-space: nowrap;
      }
    }
  }
}
</style>
