<template lang="pug">
  section(:class='b()')
    span Footer
    slot
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "t-footer"
})
export default class extends Vue {}
</script>
