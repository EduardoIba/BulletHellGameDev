import { ref } from "vue";

const state = ref("menu");

const setState = (newState) => {
  state.value = newState;
};

export function useState() {
  return {
    state,
    setState,
  };
}