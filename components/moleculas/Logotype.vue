<template lang="pug">
  h1.is-size-3(:class='b()') Duxi
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "m-logotype"
})
export default class extends Vue {}
</script>

<style lang="scss">
.m-logotype {
  text-transform: uppercase;
}
</style>
