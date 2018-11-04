<template lang="pug">
  span(:class='b()') {{ distance }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import {
  distanceInWordsToNow,
  distanceInWords,
  distanceInWordsStrict
} from "date-fns";
import { setInterval } from "timers";

@Component({
  name: "o-from-now"
})
export default class extends Vue {
  @Prop() value: string;

  @Prop({ default: true })
  seconds: boolean;

  now: number = new Date().getTime();
  interval: any = null;

  mounted() {
    this.interval = setInterval(this.updateTime.bind(this), 1000);
  }

  beforeDestroy() {
    clearInterval(this.interval);
  }

  updateTime() {
    this.now = new Date().getTime();
  }

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
    return distanceInWordsStrict(this.time, this.now, {
      unit: "s"
    });
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
