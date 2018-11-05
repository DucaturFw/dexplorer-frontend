<template lang="pug">
  section(:class='b()' :style='style')
    slot
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";

@Component({
  name: "t-container"
})
export default class extends Vue {
  @Prop({ default: 10 })
  padding: number;

  get style() {
    return {
      padding: `${this.padding}px`
    };
  }
}
</script>


<style lang="scss">
.t-container {
  padding: 10px;
}
</style>
