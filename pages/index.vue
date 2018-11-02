<template lang="pug">
  section(:class="b()")
    b-table(:data='blocks')
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { IBlock } from "store";

@Component({})
export default class extends Vue {
  @State latestBlocks: IBlock[];
}
</script>
<style scoped>
</style>