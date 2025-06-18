<template>
  <transition name="fade">
    <div class="tela-final">
      <div class="tela-final-content">
        <h2 class="screen-title">Você Venceu!</h2>
        <div class="final-stats">
          <p>
            Pontuação Total: <span>{{ pontos }}</span>
          </p>
          <p>
            Tempo de Jogo: <span>{{ tempoFinal }}s</span>
          </p>
        </div>
        <button class="menu-button" @click="voltarAoMenuPrincipal">
          Voltar ao Menu
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "WinScreen",
  props: {
    pontos: {
      type: Number,
      required: true,
    },
    tempoFinal: {
      type: Number,
      required: true,
    },
    voltarAoMenuPrincipal: {
      type: Function,
      required: true,
    },
  },
};
</script>
