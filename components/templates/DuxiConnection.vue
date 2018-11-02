<template lang="pug">
  div
    h1 test
</template>

<script lang="ts">
import { DuxiConnection } from "~/plugins/api";
import {
  StateMutation,
  CommitMutation,
  IChainConfig,
  ChainCode,
  IBlock
} from "~/store";
import { Vue, Component, Watch } from "nuxt-property-decorator";
import { State, Action } from "vuex-class";
import { Subscription } from "rxjs";

@Component({
  name: "duxi"
})
export default class extends Vue {
  @State chains: Array<IChainConfig>;
  @State selectedChain: ChainCode;
  @Action("selectedChain") selectedChainChange: CommitMutation<ChainCode>;
  @Action("chainHeight") chainHeightChange: CommitMutation<number>;
  @Action("price") priceChange: CommitMutation<number>;
  @Action("marketCap") marketCapChange: CommitMutation<number>;
  @Action("recentBlockReceive") recentBlockReceive: CommitMutation<IBlock>;

  $connection: DuxiConnection;
  subscriptions: Subscription[] = [];

  @Watch("selectedChain")
  changeChain(chain: ChainCode) {
    this.$connection.watch(chain);
  }

  beforeDestroy() {
    console.log("unsubscribe from updates");
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  mounted() {
    console.log("subscribe on updates");
    this.subscriptions = [
      this.$connection.height.subscribe(this.chainHeightChange),
      this.$connection.price.subscribe(this.priceChange),
      this.$connection.cap.subscribe(this.marketCapChange),
      this.$connection.blocks.subscribe(this.recentBlockReceive)
    ];

    if (!this.selectedChain) {
      this.selectedChainChange(this.chains[0].code);
    }
  }
}
</script>

