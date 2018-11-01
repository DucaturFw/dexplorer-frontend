<template lang="pug">
  section(:class='b()')
    nuxt-link(:class="b('link')" to='/') Home
    nuxt-link(:class="b('link')" to='/') Blocks
    nuxt-link(:class="b('link')" to='/') Transactions
    nuxt-link(:class="b('link')" to='/') Events
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "o-menu"
})
export default class extends Vue {}
</script>

<style lang="scss">
.o-menu {
  &__link {
    font-family: "Montserrat", sans-serif;
    font-weight: bold;
    margin-left: 20px;
  }
}
</style>
