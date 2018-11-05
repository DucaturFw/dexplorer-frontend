<template lang="pug">
  span(:class='b()') {{ splited }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";

@Component({
  name: "o-value"
})
export default class extends Vue {
  @Prop() value: string;

  @Prop({ default: 0 })
  decimals: number;
  @Prop({ default: " " })
  delimiter: string;

  get raw() {
    if (this.$slots.default && this.$slots.default.length) {
      return this.$slots.default[0].text!;
    } else {
      return this.value;
    }
  }

  get number() {
    return parseFloat(this.raw);
  }

  get decimal() {
    return this.number.toFixed(this.decimals);
  }

  get splited() {
    return this.decimal.replace(/\B(?=(\d{3})+(?!\d))/g, this.delimiter);
  }
}
</script>

<style lang="scss">
.o-value {
}
</style>
