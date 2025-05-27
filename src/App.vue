<template>
  <SchoolPocalypse />
</template>

<script>
import SchoolPocalypse from './components/SchoolPocalypse.vue';

export default {
  name: 'App',
  components: {
    SchoolPocalypse
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
