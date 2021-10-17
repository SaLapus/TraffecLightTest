<template>
  <div
    class="ligth"
    :class="{ active, attention: needAttention }"
    :style="colorStyle"
  ></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Color extends Vue {
  @Prop() private color!: string;
  @Prop() private attention!: boolean;

  get active(): boolean {
    const currentColor = this.$store.state.color.current;

    return this.color === currentColor ? true : false;
  }

  get needAttention(): boolean {
    const currentColor = this.$store.state.color.current;

    return this.attention && this.color === currentColor ? true : false;
  }

  get colorStyle(): Record<string, unknown> {
    return {
      "background-color": this.color,
      opacity: this.active ? 1 : 0.5,
    };
  }
}
</script>

<style lang="sass">
.ligth
  height: 100px
  width: 100px
  border-radius: 50px

  &.active
    animation:
      name: turn_on
      duration: 1s
      iteration-count: 1
      timing-function: ease-out

  &.attention
    animation:
      name: attention
      duration: 0.5s
      iteration-count: infinite
      timing-function: ease-out
      direction: alternate

@keyframes turn_on
  from
    opacity: 0.5
  to
    opacity: 1

@keyframes attention
  from
    opacity: 1
  to
    opacity: 0.5
</style>