<template lang="pug">
  span(:class='b()')
    slot(name='prefix')
      span(:class='b("prefix")' v-if='prefix') {{ prefix }}
    m-value(:class='b()' :delimiter='delimiter' :decimals='decimals') {{ raw }}
    slot(name='suffix')
      span(:class='b("suffix")' v-if='suffix') {{ suffix }}
</template>


<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import ValueVue from "./Value.vue";

@Component({
  name: "o-value",
  components: {
    "m-value": ValueVue
  }
})
export default class extends Vue {
  @Prop() value: string;

  @Prop({ default: "" })
  prefix: string;
  @Prop({ default: "" })
  suffix: string;

  @Prop({ default: 0 })
  decimals: number;
  @Prop({ default: " " })
  delimiter: string;

  get raw() {
    if (this.$slots.default && this.$slots.default.length) {
      return this.$slots.default[0].text!;
    } else {
      return this.value;
    }
  }
}
</script>

<style lang="scss">
.o-money {
}
</style>
