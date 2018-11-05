<template lang="pug">
  span(:class='b()') {{ distance }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
// import {
//   distanceInWordsToNow,
//   distanceInWords,
//   distanceInWordsStrict
// } from "date-fns";
import { setInterval } from "timers";
import { State } from "vuex-class";

@Component({
  name: "o-from-now"
})
export default class extends Vue {
  @State now: number;

  @Prop() value: string;

  @Prop({ default: true })
  seconds: boolean;

  interval: any = null;

  get raw() {
    if (this.$slots.default && this.$slots.default.length) {
      return this.$slots.default[0].text!;
    } else {
      return this.value;
    }
  }

  get time() {
    return parseInt(this.raw) * 1000;
  }

  get distance() {
    const a = Math.floor((this.now - this.time) / 1000);

    if (0 == a) return "0 s";
    const c = 60,
      d = 0,
      e = ["sec", "min", "hours"],
      f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    // return distanceInWordsStrict(this.time, this.now, {
    //   unit: "s"
    // });
    // return distanceInWords(this.time, this.now, {
    //   includeSeconds: true
    //   // addSuffix: true
    // });
  }
}
</script>

<style lang="scss">
.o-from-now {
}
</style>
