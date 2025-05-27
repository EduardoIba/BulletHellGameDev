<template>
  <div>
    <canvas ref="canvas" :width="width" :height="height" style="background: black;"></canvas>
    <div v-if="estado === 'menu'" class="menu">
      <h1 style="color: red">SchoolPocalypse</h1>
      <button @click="iniciarJogo" style="color: red;">Iniciar Jogo</button>
    </div>
    <div v-if="estado === 'gameover'" class="gameover">
      <h1 style="color: white">Game Over</h1>
      <button @click="reiniciarJogo">Reiniciar Jogo</button>
    </div>
  </div>
</template>

<script>
import { carregarSprites } from '../utils/carregarSprites.js';
import { carregarFundos } from '../utils/carregarFundos.js';
import { drawImage } from '../utils/drawImage.js';
import { zonasPorFase } from '../utils/zonasPorFase.js';
import { atualizarZonasDeColisao, verificarColisaoDeProjetil } from '../utils/colisao.js';
import { verificarTeclaPressionada } from '../utils/verificarTeclaPressionada.js';
import { gerarInimigosPorFase } from '../utils/gerarInimigosPorFase.js';
import { gerarBoss } from '../utils/gerarBoss.js';
import { atirarProjeteis } from '../utils/atirarProjeteis.js';

export default {
  name: "GameCanvas",
  data() {
    return {
      zonasDeColisao: [],
      fundos: [],
      fundoAtual: null,
      width: window.innerWidth,
      height: window.innerHeight,
      imagens: [],
      projectiles: [],
      powerUps: [],
      inimigos: [],
      estado: "menu",
      animationId: null,
      projectileInterval: null,
      tempoInterval: null,
      keysPressed: {},
      tempo: 0,
      pontos: 0,
      nivel: 1,
      velocidadeProjeteis: 3,
      vidas: 3,
      slowAtivo: false,
      slowTimeoutId: null,
      trocaFaseDelay: false,
      boss: null, // dados do boss
      bossDirecao: 1, // 1 para descer, -1 para subir
      player: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }
    };
  },

  mounted() {
    this.imagens = carregarSprites();

    carregarFundos().then((imgs) => {
      this.fundos = imgs;
      this.fundoAtual = imgs[0];
    });

  },

  methods: {
    iniciarJogo() {
      this.player.x = this.width / 2;
      this.player.y = this.height / 2;
      this.projectiles = [];
      this.powerUps = [];
      this.estado = "jogando";
      this.tempo = 0;
      this.pontos = 0;
      this.nivel = 1;
      this.fundoAtual = this.fundos[0];
      this.zonasDeColisao = atualizarZonasDeColisao(this.nivel, zonasPorFase());
      this.velocidadeProjeteis = 3;
      this.vidas = 3;
      this.slowAtivo = false;
      this.trocaFaseDelay = false;
      this.boss = null;
      this.bossDirecao = 1;
      this.setupInimigos();
      this.$nextTick(() => {
        this.setupControles();
        this.iniciarTimer();
        this.iniciarLoop();
      });
    },

    reiniciarJogo() {
      this.iniciarJogo();
    },

    setupControles() {
      window.addEventListener("keydown", (e) => {
        this.keysPressed[e.key] = true;
      });
      window.addEventListener("keyup", (e) => {
        this.keysPressed[e.key] = false;
      });
    },

    setupInimigos() {
      const size = 40;
      const padding = 50;

      if (this.nivel === 5) {
        this.inimigos = [];
        this.boss = gerarBoss(this.width, this.height);
      } else {
        this.boss = null;
        this.inimigos = gerarInimigosPorFase(this.nivel, this.width, this.height, size, padding);
      }
    },

    iniciarTimer() {
      clearInterval(this.tempoInterval);
      this.tempoInterval = setInterval(() => {
        if (this.estado !== "jogando") return;

        this.tempo++;
        if (this.tempo % 15 === 0 && this.nivel < 5 && !this.trocaFaseDelay) {
          this.trocaFaseDelay = true;
          setTimeout(() => {
            this.nivel++;
            this.zonasDeColisao = atualizarZonasDeColisao(this.nivel, zonasPorFase());
            this.fundoAtual = this.fundos[this.nivel - 1];
            this.pontos += 25; // Pontos ao passar de fase
            this.velocidadeProjeteis += 1;

            if (this.nivel === 5) {
              this.projectiles = []; // Limpa projéteis antigos ao entrar na fase 5
            }

            this.setupInimigos();
            this.trocaFaseDelay = false;
          }, 3000); // Delay de 3 segundos na troca de fase
        }
        this.pontos += 10; // Pontos a cada segundo
      }, 1000);
    },

    iniciarLoop() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      // Criar power-ups aleatórios (life e slow)
      this.projectileInterval = setInterval(() => {
        if (this.estado !== "jogando") return;

        // spawn power-up
        const spawnChance = Math.random();
        if (spawnChance < 0.05) {
          const powerUp = {
            x: Math.random() * this.width,
            y: -50,
            r: 10,
            type: Math.random() < 0.5 ? "life" : "slow",
          };
          this.powerUps.push(powerUp);
        }
      }, 300);

      this.animate(ctx);
    },

    animate(ctx) {
      if (this.estado !== "jogando") {
        cancelAnimationFrame(this.animationId);
        clearInterval(this.projectileInterval);
        clearInterval(this.tempoInterval);
        return;
      }

      if (this.fundoAtual) {
        ctx.drawImage(this.fundoAtual, 0, 0, this.width, this.height);
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
      }

      const speed = 5;
      const nextPositions = {
        up: { x: this.player.x, y: this.player.y - speed },
        down: { x: this.player.x, y: this.player.y + speed },
        left: { x: this.player.x - speed, y: this.player.y },
        right: { x: this.player.x + speed, y: this.player.y },
      };

      verificarTeclaPressionada(
        this.keysPressed,
        this.zonasDeColisao,
        nextPositions,
        this.player,
        speed,
      );

      const metadePlayer = 20; // metade do tamanho do player (40/2)

      this.player.x = Math.max(metadePlayer, Math.min(this.width - metadePlayer, this.player.x));
      this.player.y = Math.max(metadePlayer, Math.min(this.height - metadePlayer, this.player.y));

      // HUD (sobreposto ao jogo)
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`Tempo: ${this.tempo}s`, 20, 30);
      ctx.fillText(`Pontos: ${this.pontos}`, 20, 60);
      ctx.fillText(`Fase: ${this.nivel}`, 20, 90);
      ctx.fillText(`Vidas: ${this.vidas}`, 20, 120);

      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      this.zonasDeColisao.forEach((zona) => {
        ctx.fillRect(zona.x, zona.y, zona.width, zona.height);
      });

      // Player
      const playerSize = 40;
      drawImage(ctx, this.imagens.player, this.player.x, this.player.y, playerSize, playerSize);

      if (this.nivel < 5) {
        // Inimigos normais
        this.processarInimigos(ctx);
      } else {
        // Fase 5 - boss
        this.processarBoss(ctx);
      }

      // Projéteis
      this.processarProjetiles(ctx);

      // Power-ups
      this.processarPowerUps(ctx);

      this.animationId = requestAnimationFrame(() => this.animate(ctx));
    },

    processarBoss(ctx) {
      this.moverBoss();
      if (!this.boss) return;
      drawImage(ctx, this.imagens.boss, this.boss.x, this.boss.y, this.boss.size, this.boss.size, 0);
      atirarProjeteis({
        atirador: this.boss,
        player: this.player,
        slowAtivo: this.slowAtivo,
        velocidadeProjeteis: this.velocidadeProjeteis,
        imagens: this.imagens,
        projectiles: this.projectiles
      }, { velocidadeMultiplicador: 2, width: 32, height: 32 });
    },

    processarInimigos(ctx) {
      this.inimigos.forEach((inimigo, index) => {
        const imgSize = inimigo.size;

        // Pega uma sprite de inimigo de forma cíclica (1 até 5)
        const spriteIndex = (index % 5) + 1;
        const img = this.imagens['inimigo' + spriteIndex];

        drawImage(ctx, img, inimigo.x, inimigo.y, imgSize, imgSize, 0);

        atirarProjeteis({
          atirador: inimigo,
          player: this.player,
          slowAtivo: this.slowAtivo,
          velocidadeProjeteis: this.velocidadeProjeteis,
          imagens: this.imagens,
          projectiles: this.projectiles
        }, { velocidadeMultiplicador: 1, width: 52, height: 52 });
      });
    },

    processarProjetiles(ctx) {
      this.projectiles = this.projectiles.filter((p) => {
        p.x += p.xVel;
        p.y += p.yVel;

        if (verificarColisaoDeProjetil(p.x, p.y, p.r, this.player.x, this.player.y, 10)) {
          this.vidas--;
          if (this.vidas <= 0) {
            this.estado = "gameover";
          }
          return false;
        }

        // Atualiza a rotação do projétil
        p.rotation += 0.05;

        // Desenha o projétil rotacionado
        drawImage(ctx, p.img, p.x, p.y, p.width, p.height, p.rotation);

        return (
          p.x >= -50 &&
          p.y >= -50 &&
          p.x <= this.width + 50 &&
          p.y <= this.height + 50
        );
      });
    },

    processarPowerUps(ctx) {
      this.powerUps = this.powerUps.filter((pu) => {
        pu.y += 2; // Velocidade do power-up

        if (verificarColisaoDeProjetil(pu.x, pu.y, pu.r, this.player.x, this.player.y, 10)) {
          this.coletarPowerUp(pu);
          return false; // Remove o power-up após pegar
        }

        const img = pu.type === "life" ? this.imagens.vida : this.imagens.slow;
        const size = 30; // tamanho da imagem do power-up
        drawImage(ctx, img, pu.x, pu.y, size, size, pu.rotation);

        return pu.y <= this.height + 50; // Mantém power-up dentro da tela
      });
    },

    coletarPowerUp(pu) {
      if (pu.type === "life") {
        this.vidas++;
      } else if (pu.type === "slow") {
        if (this.slowTimeoutId) clearTimeout(this.slowTimeoutId);
        this.slowAtivo = true;
        this.slowTimeoutId = setTimeout(() => {
          this.slowAtivo = false;
        }, 3000);
      }
    },

    moverBoss() {
      if (!this.boss) return;

      this.boss.y += this.bossDirecao * this.boss.velocidade;

      if (
        this.boss.y + this.boss.size / 2 > this.height - 50 ||
        this.boss.y - this.boss.size / 2 < 50
      ) {
        this.bossDirecao *= -1;
      }
    },

  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Creepster&display=swap');

canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: 0;
}

.menu,
.gameover {
  font-family: 'Creepster';
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  z-index: 1;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
}
</style>