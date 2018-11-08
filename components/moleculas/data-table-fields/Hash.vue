<template lang="pug">
  span(:class='b()')
    b-tooltip(placement="is-top" type='is-light' :label="hex")
      p(:class="b('wrapper')")
        span(:class='b("head")' v-if='head') {{ extractedHead }}
        template(v-for="(part, index) in parts" )
          br(v-if="row > 0 && index > 0 && index % row === 0")
          span(:class='b("part")' :style="{ color: `#${part}` }") █
        span(:class='b("tail")' v-if='tail') {{ extractedTail }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";

@Component({
  name: "o-hash"
})
export default class extends Vue {
  @Prop({ default: "" })
  value: string;

  @Prop({ default: 0 })
  row: number;

  @Prop({ default: 0 })
  head: number;
  @Prop({ default: 4 })
  tail: number;

  get raw() {
    if (this.$slots.default && this.$slots.default.length) {
      return this.$slots.default[0].text!;
    } else {
      return this.value;
    }
  }

  get hex() {
    return typeof this.raw === "string" ? this.raw : "";
  }

  get extractedHead() {
    return this.normalized.slice(0, this.head);
  }

  get extractedTail() {
    if (this.tail > 0) {
      return this.normalized.slice(-this.tail);
    } else {
      return "";
    }
  }

  get normalized() {
    return this.hex.startsWith("0x") ? this.hex.slice(2) : this.hex;
  }

  get parts() {
    if (this.tail > 0) {
      return this.normalized.slice(this.head, -this.tail).match(/.{6}/g);
    } else {
      return this.normalized.slice(this.head).match(/.{6}/g);
    }
  }
}
</script>

<style lang="scss">
.o-hash {
  letter-spacing: 0;
  &__wrapper {
    font-family: monospace;
    line-height: 0.81em;
    letter-spacing: -0.05em;
    white-space: nowrap;
    word-wrap: none;
  }
  &__tail {
    font-size: 90%;
    margin-left: 0.1em;
  }
  &__head {
    font-size: 90%;
    margin-right: 0.1em;
  }
  // &__part {
  //   line-height: 1em;
  //   // &::before {
  //   // content: "█";
  //   // }
  // }
}
</style>
