<template lang="pug">
  span(:class='b()') {{ raw }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";

@Component({
  name: "o-text"
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
}
</script>

<style lang="scss">
.o-text {
}
</style>
