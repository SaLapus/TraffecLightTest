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
    <div class="controlState">
      <button class="saving" @click="saveState">Сохранить состояние</button>
      <button class="clear" @click="clearState">Очистить состояние</button>
    </div>
    <div class="message"></div>
    <div class="savedColor"></div>
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
    sessionStorage.setItem("offset", `${this.offset.time}`);

    this.showSavedState();
    this.showMessage("Состояние сохранено");
  }

  clearState(): void {
    sessionStorage.clear();

    this.showSavedState(true);
    this.showMessage("Состояние удалено");
  }

  showMessage(msg: string): void {
    const msgPlace = document.querySelector(".message");

    if (msgPlace) {
      msgPlace.textContent = msg;

      setTimeout(() => (msgPlace.textContent = ""), 5 * 1000);
    }
  }

  showSavedState(clear?: boolean): void {
    const msgPlace = document.querySelector(".savedColor");

    if (clear && msgPlace) {
      msgPlace.textContent = "";
      return;
    }

    const prev = sessionStorage.getItem("prevColor");
    const current = sessionStorage.getItem("curColor");
    const offset = sessionStorage.getItem("offset");

    if (msgPlace)
      msgPlace.textContent = `Предыдущее значение: ${prev}\nТекущее значение: ${current}\nЗначение таймера: ${offset}`;
  }
}
</script>

<style lang="sass">
$width: 700px

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

  .colors
    margin:
      top: 10px
      bottom: 20px

  .controlState
    margin:
      top: 10px
      bottom: 10px

    button
      font:
        size: 15px
        weight: 100

  .message
    font:
      size: 25px
      weight: 100

@media screen and (max-width: $width)
  .colors
    display: inline-block

@media screen and (min-width: $width)
  .colors
    display: inline-flex
</style>
