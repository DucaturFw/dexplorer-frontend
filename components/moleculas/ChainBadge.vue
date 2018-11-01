<template lang="pug">
  div(:class="b()") 
    img(:class="b('icon')" :src="icon")
    h3(:class="b('name')") {{ name }}
    span(:class="b('ticker')") {{ ticker }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";

@Component({
  name: "m-chain-badge"
})
export default class extends Vue {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ticker: string;

  @Prop({ required: true })
  icon: string;
}
</script>


<style lang="scss">
.m-chain-badge {
  display: flex;
  align-items: center;

  &__icon {
    width: 40px;
    margin-right: 10px;
  }

  &__name {
    margin-right: auto;
  }

  &__ticker {
    margin-left: 10px;
    opacity: 0.5;
    font-size: 80%;
    font-weight: bold;
  }
}
</style>
