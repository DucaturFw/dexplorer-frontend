import Vue from "vue";
import deepmerge from "deepmerge";
import { Line } from "vue-chartjs";

Vue.component(
  "line-chart",
  Vue.extend(
    deepmerge(Line, {
      props: ["data", "options"],
      mounted() {
        this.updateChart();
      },
      watch: {
        data: "updateChart",
        options: "updateChart"
      },
      methods: {
        updateChart() {
          this.renderChart(this.data, this.options);
        }
      }
    })
  )
);
