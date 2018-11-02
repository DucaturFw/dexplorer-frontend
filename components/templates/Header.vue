<template lang="pug">
  section(:class='b()')
    div(:class="b('inner')")
      slot
    div(:class="b('under')")
      slot(name='under')
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "t-header"
})
export default class extends Vue {}
</script>

<style lang="scss">
.t-header {
  &__inner {
    display: flex;
    align-items: center;
    min-height: 80px;
    padding-left: 10px;
    padding-right: 10px;
  }

  &__under {
    background-color: #2623a0;
    padding: 5px;
    // display: flex;
    // flex-direction: row;
    // flex-wrap: wrap;
  }
}
</style>

