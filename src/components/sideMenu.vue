<template>
  <transition name="slide-right">
    <div class="in-game-menu">
      <h3 class="in-game-menu-title">Menu</h3>
      <VolumeControl
        :volumeMusica="volumeMusica"
        :updateVolume="updateVolume"
        :tipo="'side-menu'"
      />
      <div class="in-game-menu-buttons">
        <button
          class="menu-button in-game-button"
          @click="voltarAoMenuPrincipal"
        >
          Voltar ao Menu Principal
        </button>
        <button
          v-if="nivel < 5"
          class="menu-button in-game-button"
          @click="pularFase"
        >
          Pular Fase
        </button>
        <button class="menu-button in-game-button" @click="toggleGameMenu">
          Continuar Jogo
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { useState } from "../useState.js";
import VolumeControl from "../ui/volumeControl.vue";
export default {
  name: "SideMenu",
  components: {
    VolumeControl,
  },
  props: {
    nivel: {
      type: Number,
      required: true,
    },
    toggleGameMenu: {
      type: Function,
      required: true,
    },
    voltarAoMenuPrincipal: {
      type: Function,
      required: true,
    },
    pularFase: {
      type: Function,
      required: true,
    },
    volumeMusica: {
      type: Number,
      required: true,
    },
    updateVolume: {
      type: Function,
      required: true,
    },
  },
};
</script>
