<template lang="pug">
  section(:class='b()')
    slot
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component({
  name: "t-content"
})
export default class extends Vue {}
</script>
