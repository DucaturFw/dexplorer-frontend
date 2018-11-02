<template lang="pug">
  section(:class="b()")
    link(rel="stylesheet" href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css")
    link(rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Montserrat:700&amp;subset=cyrillic")
    t-header.has-background-dark.has-text-white-bis(:class="b('header')")
      m-logotype(:class="b('logotype')")
      o-chain-select(:chains='chains' v-model='selected' :class="b('chains')")
      o-menu(:class="b('menu')")
      o-search
      o-flex(direction='row' :wrap='true' slot="under" align='center')
        .card.o-flex__item.o-flex__item--grow
          line-chart(:data='tpsChartData' :options='tpsChartOptions' style='position: absolute; left: 0; top: 0; bottom: 0; right: 0;z-index: 1')
          .card-content(style="z-index: 2; position: relative")
            p.title 250/4992
            p.subtitle current/max tps
        .card.o-flex__item.o-flex__item--grow
          .card-content
            p.title 24,654,231
            p.subtitle head block
        .card.o-flex__item.o-flex__item--grow
          line-chart(:data='tpsChartData' :options='tpsChartOptions' style='position: absolute; left: 0; top: 0; bottom: 0; right: 0;z-index: 1')
          .card-content(style="z-index: 2; position: relative")
            p.title $201.32
            p.subtitle avg. price
        .card.o-flex__item.o-flex__item--grow
          line-chart(:data='tpsChartData' :options='tpsChartOptions' style='position: absolute; left: 0; top: 0; bottom: 0; right: 0;z-index: 1')
          .card-content(style="z-index: 2; position: relative")
            p.title 4 132
            p.subtitle mempool size
        .card.o-flex__item.o-flex__item--grow
          .card-content
            p.title $20 534 216 924
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
import Header from "~/components/templates/Header.vue";
import Content from "~/components/templates/Content.vue";
import Footer from "~/components/templates/Footer.vue";
import Logotype from "~/components/moleculas/Logotype.vue";
import ChainSelect from "~/components/organisms/ChainSelect.vue";
import Menu from "~/components/organisms/Menu.vue";
import Search from "~/components/organisms/Search.vue";
import Flex from "~/components/organisms/Flex.vue";
import LineChart from "~/components/organisms/LineChart.vue";
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "default-layout",
  components: {
    "t-header": Header,
    "t-content": Content,
    "t-footer": Footer,
    "o-menu": Menu,
    "o-search": Search,
    "o-flex": Flex,
    "o-chain-select": ChainSelect,
    "m-logotype": Logotype
  }
})
export default class extends Vue {
  chains = [
    { name: "Ethereum", ticker: "ETH", code: "eth", icon: "" },
    { name: "EOSIO", ticker: "EOS", code: "eos", icon: "" },
    { name: "Bitcoin", ticker: "BTC", code: "btc", icon: "" },
    { name: "Neo", ticker: "NEO", code: "neo", icon: "" }
  ].map(
    chain => (
      (chain.icon = `https://static.coincap.io/assets/icons/${
        chain.code
      }@2x.png`),
      chain
    )
  );

  selected = "eth";

  get tpsChartData() {
    return {
      labels: Array(7 * 12).fill(0),
      datasets: [
        {
          label: "Transactions",
          backgroundColor: "rgba(247, 21, 104, 0.15)",
          borderColor: "rgba(247, 21, 104, 0.15)",
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
