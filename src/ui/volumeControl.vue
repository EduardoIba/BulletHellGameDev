<template>
  <div :class="['', tipo === 'options' ? 'option-group' : tipo === 'side-menu' && 'option-group-compact']">
    <h3>Volume da Música</h3>
    <div :class="['', tipo === 'options' ? 'volume-control' : tipo === 'side-menu' && 'volume-control-compact']">
      <label for="musicVolume">Volume:</label>
      <input
        type="range"
        id="musicVolume"
        min="0"
        max="100"
        v-model="volume"
        @input="updateVolume('musica', $event.target.value)"
      />
      <span>{{ volumeMusica }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "VolumeControl",
  props: {
    volumeMusica: {
      type: Number,
      required: true,
    },
    updateVolume: {
      type: Function,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    }
  },
  computed: {
    volume: {
      get() {
        return this.volumeMusica;
      },
      set(value) {
        this.updateVolume("musica", Number(value));
      },
    },
  },
};
</script>
