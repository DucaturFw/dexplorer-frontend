<template lang="pug">
  b-field(:class="b()")
    b-input(placeholder="Search..." type="search" :class="b('field')")
    p.control(:class="b('control')")
      button.button.is-primary(:class="b('button')") 
        i.mdi.mdi-magnify
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "o-search"
})
export default class extends Vue {}
</script>

<style lang="scss">
</style>
