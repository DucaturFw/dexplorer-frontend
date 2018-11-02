<template lang="pug">
  b-dropdown(:value='value' @change='v => $emit("input", v)' :class="b()")
    m-chain-badge(slot='trigger' :class="b('selected')" :icon='selectedChain.icon' :name='selectedChain.name' :ticker='selectedChain.ticker')
    b-dropdown-item(v-for='chain in chains' :value='chain.code')
      span {{chain.name }}
</template>

<script lang="ts">
import ChainBadge from "~/components/moleculas/ChainBadge.vue";
import { Component, Vue, Prop, Watch } from "nuxt-property-decorator";
import { IChainConfig, ChainCode } from "store";

@Component({
  name: "o-chain-select",
  components: {
    "m-chain-badge": ChainBadge
  }
})
export default class extends Vue {
  @Prop({ required: true })
  chains: Array<IChainConfig>;

  @Prop({ required: true })
  value: ChainCode;

  get selectedChain(): IChainConfig {
    return this.chains.filter(chain => chain.code === this.value)[0];
  }
}
</script>


<style lang="scss">
.o-chain-select {
  align-self: stretch;
  display: flex;

  div {
    width: 100%;
  }

  &__selected {
    height: 80px;
    padding: 10px;
    transition: background-color 0.1s ease;
    background-color: #2623a0;
    cursor: pointer;
  }
  &:hover {
    .o-chain-select__selected {
      background-color: #252290;
    }
  }
}
</style>
