<template lang="pug">
  div(:class="b()")
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({
  name: "o-flex"
})
export default class extends Vue {
  @Prop({ default: false })
  wrap: boolean;

  @Prop({ default: "row" })
  direction: "row" | "column" | "row-reverse" | "column-reverse";

  @Prop({ default: "stretch" })
  align: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";

  @Prop({ default: "flex-start" })
  justify:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";

  get modificators() {
    return {
      wrap: this.wrap,
      direction: this.direction,
      align: this.align,
      justify: this.justify
    };
  }
}
</script>

<style lang="scss">
.o-flex {
  display: flex;

  &--align {
    &-flex-start {
      align-items: flex-start;
    }
    &-flex-end {
      align-items: flex-end;
    }
    &-center {
      align-items: center;
    }
    &-baseline {
      align-items: baseline;
    }
    &-stretch {
      align-items: stretch;
    }
  }

  &--justify {
    &-flex-start {
      justify-content: flex-start;
    }
    &-flex-end {
      justify-content: flex-end;
    }
    &-center {
      justify-content: center;
    }
    &-space-between {
      justify-content: space-between;
    }
    &-space-around {
      justify-content: space-around;
    }
  }

  &--direction {
    &-row {
      flex-direction: row;
    }
    &-column {
      flex-direction: column;
    }
    &-row-reverse {
      flex-direction: row-reverse;
    }
    &-column-reverse {
      flex-direction: column-reverse;
    }
  }

  &--wrap {
    flex-wrap: wrap;
  }

  &__item {
    &--grow {
      flex-grow: 1;
    }
  }
}
</style>
