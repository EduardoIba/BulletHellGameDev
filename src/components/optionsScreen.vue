<template>
  <transition name="slide-up">
    <div class="options-content">
      <h2 class="screen-title">Opções</h2>
      <VolumeControl
        :volumeMusica="volumeMusica"
        :updateVolume="updateVolume"
        :tipo="'options'"
      />
      <div class="option-group">
        <h3>Controles</h3>
        <ul class="controls-list">
          <li>Movimento: <strong>W, A, S, D</strong></li>
        </ul>
      </div>
      <button class="menu-button back-button" @click="setState('menu')">
        Voltar ao Menu
      </button>
    </div>
  </transition>
</template>
<script>
import { useState } from "../useState.js";
import VolumeControl from "../ui/volumeControl.vue";
export default {
  name: "OptionsScreen",
  setup() {
    const { setState } = useState();
    return { setState };
  },
  components: {
    VolumeControl,
  },
  props: {
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
