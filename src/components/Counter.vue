<template>
  <div class="counter">{{ offset }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Counter extends Vue {
  @Prop() private offset!: number;
}
</script>

<style lang="sass">
.counter
  font-size: 30px
  font-weight: 100

  margin:
    top: 10px
    bottom: 20px
</style>