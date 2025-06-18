<template>
  <transition name="slide-down">
    <div class="credits-screen">
      <div class="credits-content">
        <h2 class="screen-title">Créditos</h2>
        <div class="credits-names">
          Bruno Koji<br />
          Eduardo Iba<br />
          Eric Leite<br />
          Gabriel Morais<br />
          Gustavo Beneton
        </div>
        <div class="credits-special">
          <strong>Agradecimentos Especiais:</strong><br />
          Aos nossos professores, à comunidade Vue.js e a todos que nos apoiaram
          neste projeto!
        </div>
        <button class="menu-button back-button" @click="setState('menu')">
          Voltar ao Menu
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { useState } from "../useState.js";

export default {
  name: "Credits",
  setup() {
    const { setState } = useState();
    return {
      setState,
    };
  },
};
</script>
