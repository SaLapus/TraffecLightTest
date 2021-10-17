<template>
  <div id="app">
    <div class="colors">
      <Color
        v-for="color in colors"
        :key="color.name"
        :color="color.name"
        :attention="needAttention"
      />
    </div>
    <Counter :offset="offset.time" />
    <button @click="saveState">Сохранить состояние</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Counter from "@/components/Counter.vue";
import Color from "@/components/Color.vue";

@Component<App>({
  components: {
    Counter,
    Color,
  },
})
export default class App extends Vue {
  colors = this.$store.state.colors;
  offset = {
    time: 0,
    timer: 0,
  };

  // Computed Props
  get needAttention(): boolean {
    return this.offset.time <= this.$store.state.alertOffset;
  }

  // Lifecycle Hooks
  mounted(): void {
    this.fixCurrentPath();

    this.$router.beforeEach((to, from, next) => {
      this.waitForNextStep();
      next();
    });

    this.waitForNextStep();
  }

  // Methods

  // Fixing route when loading with saved state
  fixCurrentPath(): void {
    const curColor = this.$store.state.color.current;
    const curPath = this.$route.path.substr(1);

    if (curColor !== curPath) this.$router.replace({ path: curColor });
  }

  waitForNextStep(): void {
    const colorName: string = this.$store.state.color.current;
    const offset: number = this.$store.getters.getColorOffset(colorName);

    this.offset.time = offset;
    this.setCounter();

    setTimeout(this.nextStep, offset * 1000);
  }

  nextStep(): void {
    const nextColor = this.$store.getters.nextColor;

    this.$store.commit("changeColor", nextColor);

    this.$router.push({ path: nextColor }).catch(console.log);
  }

  setCounter(): void {
    if (this.offset.timer) clearInterval(this.offset.timer);
    this.offset.timer = setInterval(() => {
      if (this.offset.time > 0) this.offset.time -= 1;
    }, 1000);
  }

  saveState(): void {
    const { prev, current } = this.$store.state.color;

    sessionStorage.setItem("prevColor", prev);
    sessionStorage.setItem("curColor", current);
  }
}
</script>

<style lang="sass">
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
</style>
