<template lang="pug">
  span(:class='b()') {{ formated }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { format } from "date-fns";
import { setInterval } from "timers";

@Component({
  name: "o-date"
})
export default class extends Vue {
  @Prop() value: string;

  @Prop({ default: "HH:mm" })
  format: string;

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

  get formated() {
    return format(this.time, this.format);
  }
}
</script>

<style lang="scss">
.o-date {
}
</style>
