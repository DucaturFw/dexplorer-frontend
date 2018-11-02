declare module "*.vue" {
  import Vue from "vue";
  const _default: Vue;
  export default _default;
}

// ComponentOptions is declared in types/options.d.ts
declare module "vue/types/options" {
  import Vue from "vue";
  import { Store } from "vuex";

  interface NuxtContext<V extends Vue> {
    app: V;
    isClient: boolean;
    isServer: boolean;
    isStatic: boolean;
    isDev: boolean;
    store: Store<any>; // Consider vuex-typex in future
    env: object;
    params: object;
    query: object;
  }

  interface VueClass<V extends Vue> {
    asyncData?(context: NuxtContext<V>): Promise<object> | object;
    fetch?(context: NuxtContext<V>): Promise<object> | object;
    $axios: typeof import("axios");
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $axios: typeof import("axios");
  }
}
