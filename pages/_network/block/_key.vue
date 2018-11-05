<template lang="pug">
  section(:class="b()")
    .tile.is-vertical
      .tile
        t-container.tile.is-child.has-background-black-ter.has-text-white-bis(:padding='30')
          h2.is-size-1 Block \#{{ block.height}}
          m-hash.is-size-1(:value='block.hash' :head='0' :tail='0')
            
        t-container.tile.is-child.has-background-primary.has-text-white-bis(:padding='30')
      .tile
        t-container.tile.is-child(:padding='30')
          h3.is-size-3 Core
        t-container.tile.is-child.has-background-white-ter(:padding='30')
          h3.is-size-3 Ethereum specific
      t-container.tile.is-child.has-background-white-ter(:padding='30')
        h3.is-size-3 Transactions

</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import { State } from "vuex-class";
import { setTimeout } from "timers";
import { IBlock } from "store";

import ContainerVue from "~/components/templates/Container.vue";
import HashVue from "~/components/moleculas/data-table-fields/Hash.vue";

@Component(<any>{
  name: "l-page",
  components: {
    "t-container": ContainerVue,
    "m-hash": HashVue
  },
  async asyncData(context) {
    console.log(Object.keys(context));
    // return {};
    let hash = "";
    let height = -1;
    let block: IBlock | null = null;
    const key = context.route.params.key;

    // 0xe7acaa06d6ea7503af596c2af1639164de3ca2c93e4a7fc4a1350d1e86a6b222
    if (
      typeof key === "string" &&
      (key.length === 64 || key.startsWith("0x"))
    ) {
      // hash
      hash = key.startsWith("0x") ? key.slice(2) : key;
      block = await context.app.$connection.getBlockByHash(hash);
    } else if (/^\d+$/.test(key)) {
      height = parseInt(key);
      block = await context.app.$connection.getBlockByHeight(height);
    } else {
      throw new Error("incorrect block identity");
    }

    console.log(block);

    return {
      block,
      hash,
      height,
      test: "foo"
    };
  }
})
export default class extends Vue {
  $route: any;

  hash: string = "";
  height: number = -1;
  block: IBlock | null = null;
  test: string = "bar";

  mounted() {}

  get isHash() {
    return this.hash.length === 64;
  }

  get isHeight() {
    return this.height > 0;
  }
}
</script>
