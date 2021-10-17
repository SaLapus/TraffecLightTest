import Vue from "vue";
import Vuex from "vuex";

import getSavedState from "./setSavedState";

Vue.use(Vuex);

export interface State {
  color: string;
}

const colors = [
  { name: "green", offset: 15 },
  { name: "yellow", offset: 3 },
  { name: "red", offset: 10 },
];

export default new Vuex.Store({
  state: {
    color: getSavedState(colors),
    colors,
    alertOffset: 3,
  },
  getters: {
    getColorOffset: (state) => (colorName: string) => {
      return state.colors.find((color) => color.name === colorName)?.offset;
    },
    nextColor: (state) => {
      const currentColor = state.color.current;
      const prevColor = state.color.prev;

      if (currentColor === "green" || currentColor === "red") {
        return "yellow";
      } else {
        if (prevColor === "green") {
          return "red";
        } else {
          return "green";
        }
      }
    },
  },
  mutations: {
    changeColor(state, color) {
      if (state.colors.some((c) => c.name === color)) {
        state.color.prev = state.color.current;
        state.color.current = color;
      } else {
        console.log("NO SUCH COLOR");
        console.log(color);
      }
    },
  },
  actions: {},
  modules: {},
});
