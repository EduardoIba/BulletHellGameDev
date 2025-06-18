<template>  
    <div class="game-hud">
          <div class="hud-container">
            <div class="hud-item">
              <span class="hud-label">Pontos:</span>
              <span class="hud-value">{{ pontos }}</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Fase:</span>
              <span class="hud-value">{{ faseAtualDoJogo }}</span>
            </div>
            <div class="hud-item">
              <span class="hud-label">Vida:</span>
              <div class="health-bar-container">
                <div
                  class="health-bar"
                  :style="{ width: (vidas / 3) * 100 + '%' }"
                ></div>
              </div>
            </div>
            <div class="hud-item">
              <span class="hud-label">Tempo:</span>
              <span class="hud-value">{{ tempo }}s</span>
            </div>
          </div>
        </div>
</template>

<script>
    export default {
      name: 'GameHUD',
      props: {
        pontos: {
          type: Number,
          required: true
        },
        faseAtualDoJogo: {
          type: Number,
          required: true
        },
        vidas: {
          type: Number,
          required: true
        },
        tempo: {
          type: Number,
          required: true
        }
      }
    };

</script>