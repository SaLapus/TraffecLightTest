<template>
  <div>{{ offset }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Counter extends Vue {
  @Prop() private offset!: number;
}
</script>

<style>
</style>