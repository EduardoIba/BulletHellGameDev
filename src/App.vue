<template>
  <GameCanvas />
</template>

<script>
import GameCanvas from './components/GameCanvas.vue';

export default {
  name: 'App',
  components: {
    GameCanvas
  }
};
</script>

<style>
/* Opcional: estilo global */
body {
  margin: 0;
  overflow: hidden; /* impede scroll quando o canvas ocupa toda a tela */
}
</style>
