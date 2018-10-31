<template>
  <section>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";

@Component({})
export default class extends Vue {
  @State people;
}
</script>
<style scoped>
</style>