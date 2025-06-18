<template>
  <transition name="fade-out">
    <div class="menu-content">
      <img src="../assets/LogoMenu.png" class="game-logo" alt="LOGO" />
      <div class="button-group">
        <button class="menu-button" @click="iniciarOuContinuarJogo">
          Iniciar Jogo
        </button>
        <button class="menu-button" @click="setState('opcoes')">Opções</button>
        <button class="menu-button" @click="setState('creditos')">
          Créditos
        </button>
      </div>
    </div>
  </transition>
</template>
<script>
import { useState } from "../useState.js";
export default {
  name: "Menu",
  setup() {
    const { setState } = useState();
    return { setState };
  },
  props: {
    iniciarOuContinuarJogo: {
      type: Function,
      required: true,
    },
  },
};
</script>
