<template>
  <div class="game-container">
    <video
      v-if="showPhase5Background"
      :src="videoFundoFase5"
      autoplay
      loop
      muted
      playsinline
      class="background-video"
    ></video>

    <canvas ref="canvas" :width="width" :height="height"></canvas>
    <canvas
      ref="collisionCanvas"
      :width="width"
      :height="height"
      style="display: none"
    ></canvas>

    <div v-if="state === 'menu'" class="main-menu">
      <Menu :iniciarOuContinuarJogo="iniciarOuContinuarJogo"></Menu>
    </div>

    <div v-if="state === 'historinha'">
      <Prologue
        :videos="videosHistorinha"
        :index="videoIndex"
        :avancarVideoHistorinha="avancarVideoHistorinha"
        :pularVideoHistorinha="pularVideoHistorinha"
      />
    </div>

    <div v-if="state === 'cutsceneFase'">
      <CutScenes
        ref="videoPlayerFase"
        :videos="videosDeTransicao"
        :index="currentCutsceneFaseIndex"
        :avancarVideoCutsceneFase="avancarVideoCutsceneFase"
        :pularCutsceneFase="pularCutsceneFase"
      />
    </div>

    <div v-if="state === 'cutsceneFase3'">
      <CutScenes
        ref="videoPlayerFase3"
        :videos="videosFase3"
        :index="currentCutsceneFase3Index"
        :avancarVideoCutsceneFase="avancarVideoCutsceneFase3"
        :pularCutsceneFase="pularCutsceneFase3"
      />
    </div>

    <div v-if="state === 'cutsceneFinal'">
      <CutScenes
        :videos="videosFinais"
        :index="currentCutsceneFinalIndex"
        :avancarVideoCutsceneFase="avancarVideoFinal"
        :pularCutsceneFase="pularCutsceneFinal"
        ref="videoPlayerFinal"
      />
    </div>

    <transition name="fade">
      <div v-if="state === 'countdown'" class="countdown-screen">
        <h1 class="countdown-text">{{ countdownValue }}</h1>
      </div>
    </transition>

    <div v-if="state === 'morte'">
      <GameOverScreen :renascer="renascer" />
    </div>

    <transition name="fade-slow">
      <div v-if="state === 'fadeParaFinal'" class="sombra-degrade"></div>
    </transition>

    <div v-if="state === 'telaFinal'" class="tela-final">
      <WinScreen
        :pontos="pontos"
        :tempoFinal="tempoFinal"
        :voltarAoMenuPrincipal="voltarAoMenuPrincipal"
      />
    </div>

    <div v-if="state === 'opcoes' || state === 'creditos'">
      <div class="background-menu"></div>
    </div>

    <div v-if="state === 'opcoes'" class="options-screen">
      <OptionsScreen
        :volumeMusica="volumeMusica"
        :updateVolume="updateVolume"
      />
    </div>

    <div v-if="state === 'creditos'" class="credits-screen">
      <Credits />
    </div>

    <transition name="fade">
      <div v-if="state === 'jogando'" class="in-game-ui">
        <GameHUD
          :pontos="pontos"
          :vidas="vidas"
          :faseAtualDoJogo="faseAtualDoJogo"
          :tempo="tempo"
        />

        <div v-if="faseAtualDoJogo === 5" class="fase5-barra-container">
          <div
            class="fase5-barra-progresso"
            :style="{ width: fase5Progresso + '%' }"
          ></div>
        </div>

        <button class="hamburger-button" @click="toggleGameMenu">☰</button>
        <div v-if="inGameMenuOpen">
          <SideMenu
            :nivel="nivel"
            :toggleGameMenu="toggleGameMenu"
            :voltarAoMenuPrincipal="voltarAoMenuPrincipal"
            :pularFase="pularFase"
            :volumeMusica="volumeMusica"
            :updateVolume="updateVolume"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { useState } from "./useState.js";
import Menu from "./components/mainMenu.vue";
import SideMenu from "./components/sideMenu.vue";
import WinScreen from "./components/winScreen.vue";
import GameOverScreen from "./components/gameOverScreen.vue";
import Prologue from "./components/prologue.vue";
import Credits from "./components/creditsScreen.vue";
import GameHUD from "./components/gameHUD.vue";
import CutScenes from "./components/cutScenes.vue";
import OptionsScreen from "./components/optionsScreen.vue";
import { carregarSprites } from "./utils/carregarSprites.js";
import { carregarFundos } from "./utils/carregarFundos.js";
import { drawImage } from "./utils/drawImage.js";
import {
  verificarColisaoDePixel,
  verificarColisaoDeProjetilComPlayer,
} from "./utils/colisao.js";
import { gerarInimigosPorFase } from "./utils/gerarInimigosPorFase.js";
import { gerarBoss } from "./utils/gerarBoss.js";
import { atirarProjeteis } from "./utils/atirarProjeteis.js";
import { avancarVideoCutscenes } from "./utils/avancarCutscenes.js";
import { pularCutscenesVideos } from "./utils/pularCutscenes.js";
import { iniciarCutsceneVideos } from "./utils/iniciarCutscene.js";

const {
  avancarVideoCutscenefase,
  avancarVideoCutsceneFase3,
  avancarVideoFinal,
  avancarVideoHistorinha,
} = avancarVideoCutscenes();
const {
  pularCutsceneFase,
  pularCutsceneFase3,
  pularCutsceneFinal,
  pularVideoHistorinha,
} = pularCutscenesVideos();
const { mostrarCutsceneFase, iniciarCutsceneFase3, iniciarCutsceneFinal } =
  iniciarCutsceneVideos();

export default {
  name: "GameCanvas",
  components: {
    WinScreen,
    OptionsScreen,
    Credits,
    GameHUD,
    Menu,
    SideMenu,
    GameOverScreen,
    Prologue,
    CutScenes,
  },
  data() {
    return {
      fundos: [],
      fundoAtual: null,
      width: window.innerWidth,
      height: window.innerHeight,
      imagens: {},
      projectiles: [],
      powerUps: [],
      inimigos: [],
      animationId: null,
      projectileInterval: null,
      projectileSpawnInterval: null,
      tempoInterval: null,
      keysPressed: {},
      tempo: 0,
      pontos: 0,
      pontosSalvos: 0,
      nivel: 1,
      velocidadeProjeteisPorFase: { 1: 3, 2: 4, 3: 5, 4: 6, 5: 9 },
      vidas: 3,
      slowAtivo: false,
      slowTimeoutId: null,
      trocaFaseDelay: false,
      boss: null,
      bossDirecao: 1,
      bossDirecaoX: 1,
      bossState: "attacking",
      bossTimers: { attack: null, rest: null },
      player: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: 150,
        hitboxRadius: 30,
      },
      projectileSize: 40,
      videoIndex: 0,
      historinhaJaVista: false,
      currentCutsceneFaseIndex: 0,
      nextFaseAfterCutscene: 0,
      videosDeTransicao: [
        new URL("./assets/videos/video11.mp4", import.meta.url).href,
        new URL("./assets/videos/video12.mp4", import.meta.url).href,
        new URL("./assets/videos/video13.mp4", import.meta.url).href,
        new URL("./assets/videos/video14.mp4", import.meta.url).href,
        new URL("./assets/videos/video19.mp4", import.meta.url).href,
        new URL("./assets/videos/video20.mp4", import.meta.url).href,
        new URL("./assets/videos/video21.mp4", import.meta.url).href,
        new URL("./assets/videos/video22.mp4", import.meta.url).href,
        new URL("./assets/videos/video23.mp4", import.meta.url).href,
        new URL("./assets/videos/video24.mp4", import.meta.url).href,
        new URL("./assets/videos/video25.mp4", import.meta.url).href,
        new URL("./assets/videos/video26.mp4", import.meta.url).href,
        new URL("./assets/videos/video27.mp4", import.meta.url).href,
        new URL("./assets/videos/video28.mp4", import.meta.url).href,
        new URL("./assets/videos/video29.mp4", import.meta.url).href,
        new URL("./assets/videos/video30.mp4", import.meta.url).href,
      ],
      cutsceneFaseMap: {
        2: { startIndex: 0, endIndex: 3 },
        4: { startIndex: 4, endIndex: 7 },
        5: { startIndex: 8, endIndex: 15 },
      },
      cutscenesFaseJaVistas: { 2: false, 3: false, 4: false, 5: false },
      currentCutsceneFase3Index: 0,
      videosFase3: [
        new URL("./assets/videos/video15.mp4", import.meta.url).href,
        new URL("./assets/videos/video16.mp4", import.meta.url).href,
        new URL("./assets/videos/video17.mp4", import.meta.url).href,
        new URL("./assets/videos/video18.mp4", import.meta.url).href,
      ],
      cutsceneFase3JaVista: false,
      videoMorte: new URL("./assets/videos/videomorte.mp4", import.meta.url)
        .href,
      videoFundoFase5: new URL(
        "./assets/videos/fundo_fase5.mp4",
        import.meta.url
      ).href,
      volumeMusica: 5,
      inGameMenuOpen: false,
      bgMusic: null,
      videosHistorinha: [
        new URL("./assets/videos/video1.mp4", import.meta.url).href,
        new URL("./assets/videos/video2.mp4", import.meta.url).href,
        new URL("./assets/videos/video3.mp4", import.meta.url).href,
        new URL("./assets/videos/video4.mp4", import.meta.url).href,
        new URL("./assets/videos/video5.mp4", import.meta.url).href,
        new URL("./assets/videos/video6.mp4", import.meta.url).href,
        new URL("./assets/videos/video7.mp4", import.meta.url).href,
        new URL("./assets/videos/video8.mp4", import.meta.url).href,
        new URL("./assets/videos/video9.mp4", import.meta.url).href,
        new URL("./assets/videos/video10.mp4", import.meta.url).href,
      ],
      countdownValue: 3,
      countdownIntervalId: null,
      faseAtualDoJogo: 1,
      collisionCanvas: null,
      collisionCtx: null,
      colisaoImages: {
        colisao1: null,
        colisao2: null,
        colisao3: null,
        colisao4: null,
        colisao5: null
      },
      faseColisaoMap: {
        1: "colisao3",
        2: "colisao1",
        3: "colisao5",
        4: "colisao4",
        5: "colisao2",
      },

      fase5Duracao: 30,
      fase5Timer: 0,
      fase5Intervalo: null,
      tempoFinal: 0,
      currentCutsceneFinalIndex: 0,
      videosFinais: [
        new URL("./assets/videos/video31.mp4", import.meta.url).href,
        new URL("./assets/videos/video32.mp4", import.meta.url).href,
        new URL("./assets/videos/video33.mp4", import.meta.url).href,
        new URL("./assets/videos/video34.mp4", import.meta.url).href,
        new URL("./assets/videos/video35.mp4", import.meta.url).href,
        new URL("./assets/videos/video36.mp4", import.meta.url).href,
        new URL("./assets/videos/video37.mp4", import.meta.url).href,
      ],
      tempoTotalDeJogo: 0,
      tempoTotalInterval: null,
    };
  },

  computed: {
    showPhase5Background() {
      return (
        this.faseAtualDoJogo === 5 &&
        (this.state === "jogando" || this.state === "countdown")
      );
    },
    fase5Progresso() {
      if (this.fase5Duracao === 0) return 0;
      return (this.fase5Timer / this.fase5Duracao) * 100;
    },
  },

  mounted() {
    const loadCollisionImages = () => {
      const promises = [];
      for (const key in this.colisaoImages) {
        if (Object.hasOwnProperty.call(this.colisaoImages, key)) {
          const img = new Image();
          img.src = new URL(
            `./assets/background/${key}.png`,
            import.meta.url
          ).href;
          promises.push(
            new Promise((resolve, reject) => {
              img.onload = () => {
                this.colisaoImages[key] = img;
                console.log(key)
                resolve();
              };
              img.onerror = (e) => {
                console.error(
                  `Erro ao carregar imagem de colisão ${key}.png:`,
                  e
                );
                reject(e);
              };
            })
          );
        }
      }
      return Promise.all(promises);
    };

    Promise.all([carregarSprites(), carregarFundos(), loadCollisionImages()])
      .then(([sprites, fundos]) => {
        this.imagens = sprites;
        this.fundos = fundos;
        this.fundoAtual = fundos[0];
        console.log("Todos os recursos carregados!");

        this.collisionCanvas = this.$refs.collisionCanvas;
        this.collisionCtx = this.collisionCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        this.collisionCanvas.width = this.width;
        this.collisionCanvas.height = this.height;

        this.imagens.boss_sleeping = new Image();
        this.imagens.boss_sleeping.src = new URL(
          "./assets/sprites/cartman2.png",
          import.meta.url
        ).href;
        this.imagens.boss_sleeping.onload = () =>
          console.log("Imagem do boss_sleeping carregada!");
        this.imagens.boss_sleeping.onerror = (e) =>
          console.error("Erro ao carregar a imagem do boss_sleeping:", e);

        this.bgMusic = new Audio(
          new URL("./assets/audio/music.mp3", import.meta.url).href
        );
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.volumeMusica / 100;
        this.bgMusic
          .play()
          .catch((e) =>
            console.warn("Música de fundo bloqueada pelo navegador:", e)
          );

        const startMusicOnInteraction = () => {
          if (this.bgMusic && this.bgMusic.paused) {
            this.bgMusic
              .play()
              .catch((e) =>
                console.warn("Erro ao tocar música após interação:", e)
              );
          }
          window.removeEventListener("click", startMusicOnInteraction);
          window.removeEventListener("keydown", startMusicOnInteraction);
        };
        window.addEventListener("click", startMusicOnInteraction);
        window.addEventListener("keydown", startMusicOnInteraction);
      })
      .catch((error) => {
        console.error("Erro ao carregar recursos:", error);
      });
  },
  setup() {
    const { state, setState } = useState();
    return {
      state,
      setState,
    };
  },
  
  methods: {
    setupCollisionCanvas(fase) {
      const collisionImageName = this.faseColisaoMap[fase];
      const collisionImage = this.colisaoImages[collisionImageName];
      if (this.collisionCtx && collisionImage) {
        this.collisionCtx.clearRect(0, 0, this.width, this.height);
        this.collisionCtx.drawImage(
          collisionImage,
          0,
          0,
          this.width,
          this.height
        );
      } else if (this.collisionCtx) {
        this.collisionCtx.clearRect(0, 0, this.width, this.height);
      }
    },
    iniciarOuContinuarJogo() {
      if (!this.historinhaJaVista) {
        if (this.bgMusic) this.bgMusic.pause();
        this.setState("historinha");
        this.videoIndex = 0;
        this.$nextTick(() => {
          if (this.$refs.videoPlayer) this.$refs.videoPlayer.play();
        });
      } else {
        this.iniciarGameplay(this.faseAtualDoJogo);
      }
    },
    mostrarCutsceneFase(proximaFase) {
      mostrarCutsceneFase(this, proximaFase);
    },
    iniciarCutsceneFase3() {
      iniciarCutsceneFase3(this);
    },
    iniciarCutsceneFinal() {
      iniciarCutsceneFinal(this);
    },
    avancarVideoCutsceneFase() {
      avancarVideoCutscenefase(this);
    },
    avancarVideoCutsceneFase3() {
      avancarVideoCutsceneFase3(this);
    },
    avancarVideoFinal() {
      avancarVideoFinal(this);
    },
    avancarVideoHistorinha() {
      avancarVideoHistorinha(this);
    },
    pularCutsceneFase() {
      pularCutsceneFase(this);
    },
    pularCutsceneFase3() {
      pularCutsceneFase3(this);
    },
    pularCutsceneFinal() {
      pularCutsceneFinal(this);
    },
    pularVideoHistorinha() {
      pularVideoHistorinha(this);
    },
    iniciarContagemRegressiva(proximaFaseAlvo) {
      this.fundoAtual = this.fundos[proximaFaseAlvo - 1] || this.fundos[0];
      this.setState("countdown");
      const canvas = this.$refs.canvas;
      if (canvas && this.fundoAtual) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
        if (proximaFaseAlvo !== 5) {
          ctx.drawImage(this.fundoAtual, 0, 0, this.width, this.height);
        }
      }
      this.countdownValue = 3;
      if (this.countdownIntervalId) {
        clearInterval(this.countdownIntervalId);
      }
      this.countdownIntervalId = setInterval(() => {
        if (this.countdownValue > 1) {
          this.countdownValue--;
        } else if (this.countdownValue === 1) {
          this.countdownValue = "JA!";
          setTimeout(() => {
            clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = null;
            this.avancarParaProximaFase(proximaFaseAlvo);
          }, 800);
        } else {
          clearInterval(this.countdownIntervalId);
          this.countdownIntervalId = null;
        }
      }, 1000);
    },
    avancarParaProximaFase(novaFase) {
      this.pontosSalvos = this.pontos;
      this.nivel = novaFase;
      this.faseAtualDoJogo = novaFase;
      this.projectiles = [];
      this.setupCollisionCanvas(this.nivel);
      this.pontos += 25;
      this.velocidadeProjeteis = this.velocidadeProjeteisPorFase[this.nivel];
      this.tempo = 0;
      if (this.nivel === 5) {
        this.player.x = 220;
        this.player.y = this.height / 2;
      }
      this.setupInimigos();
      this.setState("jogando");
      if (this.bgMusic && this.bgMusic.paused) {
        this.bgMusic.play().catch(e => console.warn("Erro ao retomar música:", e));
      }
      this.iniciarTimer();
      this.iniciarLoop();
      if (this.nivel === 5) {
        this.iniciarLogicaFase5();
      }
    },
    iniciarGameplay(faseParaIniciar) {
      this.setState("jogando");
      this.nivel = faseParaIniciar;
      this.faseAtualDoJogo = faseParaIniciar;
      this.velocidadeProjeteis =
        this.velocidadeProjeteisPorFase[faseParaIniciar];
      this.tempo = 0;
      if (this.faseAtualDoJogo === 5) {
        this.player.x = 220;
        this.player.y = this.height / 2;
      } else {
        this.player.x = this.width / 2;
        this.player.y = this.height / 2;
      }
      this.setupCollisionCanvas(this.nivel);
      this.setupInimigos();
      if (this.bgMusic) {
        this.bgMusic.volume = this.volumeMusica / 100;
        if (this.bgMusic.paused) {
          this.bgMusic.currentTime = 0;
          this.bgMusic
            .play()
            .catch((e) => console.warn("Erro ao retomar música:", e));
        }
      }
      this.$nextTick(() => {
        this.setupControles();
        this.iniciarTimer();
        this.iniciarLoop();
        if (faseParaIniciar === 1 && !this.tempoTotalInterval) {
          this.iniciarTimerTotal();
        }
      });
      if (this.faseAtualDoJogo === 5) {
        this.iniciarLogicaFase5();
      }
    },
    renascer() {
      if (this.state !== "morte") return;
      setTimeout(() => {
        this.setState("jogando");
        const video = this.$refs.videoMortePlayer;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        this.limparTimers();
        this.vidas = 3;
        if (this.faseAtualDoJogo === 1) {
          this.pontos = 0;
          this.pontosSalvos = 0;
          this.nivel = 1;
        } else {
          this.pontos = this.pontosSalvos;
        }
        this.tempo = 0;
        this.velocidadeProjeteis =
          this.velocidadeProjeteisPorFase[this.faseAtualDoJogo];
        this.fundoAtual =
          this.fundos[this.faseAtualDoJogo - 1] || this.fundos[0];
        if (this.faseAtualDoJogo === 5) {
          this.player.x = 220;
          this.player.y = this.height / 2;
          this.fase5Timer = 0;
        } else {
          this.player.x = this.width / 2;
          this.player.y = this.height / 2;
        }
        this.projectiles = [];
        this.powerUps = [];
        this.slowAtivo = false;
        this.setupInimigos();
        this.setupCollisionCanvas(this.faseAtualDoJogo);
        if (this.bgMusic && this.bgMusic.paused) {
            this.bgMusic.play().catch(e => console.warn("Erro ao retomar música:", e));
        }
        this.iniciarTimer();
        this.iniciarLoop();
        if (this.faseAtualDoJogo === 5) {
          this.iniciarLogicaFase5();
        }
      }, 500);
    },
    resetarEstadoDoJogo() {
      const historinhaJaVistaTemp = this.historinhaJaVista;
      const imagensTemp = this.imagens;
      const fundosTemp = this.fundos;
      const volumeMusicaTemp = this.volumeMusica;
      const bgMusicTemp = this.bgMusic;
      const cutsceneFase3JaVistaTemp = this.cutsceneFase3JaVista;
      const colisaoImagesTemp = this.colisaoImages;
      this.limparTimers();
      if (this.tempoTotalInterval) {
        clearInterval(this.tempoTotalInterval);
        this.tempoTotalInterval = null;
      }
      Object.assign(this.$data, this.$options.data.call(this));
      this.historinhaJaVista = historinhaJaVistaTemp;
      this.imagens = imagensTemp;
      this.fundos = fundosTemp;
      this.volumeMusica = volumeMusicaTemp;
      this.bgMusic = bgMusicTemp;
      this.cutsceneFase3JaVista = cutsceneFase3JaVistaTemp;
      this.colisaoImages = colisaoImagesTemp;
      this.nivel = 1;
      this.faseAtualDoJogo = 1;
      this.velocidadeProjeteis = this.velocidadeProjeteisPorFase[1];
      this.pontos = 0;
      this.pontosSalvos = 0;
      this.cutscenesFaseJaVistas = { 2: false, 3: false, 4: false, 5: false };
      this.cutsceneFase3JaVista = false;
      if (this.bgMusic) {
        this.bgMusic.volume = this.volumeMusica / 100;
        if (this.bgMusic.paused) {
          this.bgMusic
            .play()
            .catch((e) => console.warn("Erro ao tocar música:", e));
        }
      }
      this.fundoAtual = this.fundos[this.nivel - 1] || this.fundos[0];
      this.setupCollisionCanvas(this.faseAtualDoJogo);
    },
    limparTimers() {
      if (this.tempoInterval) {
        clearInterval(this.tempoInterval);
        this.tempoInterval = null;
      }
      if (this.projectileInterval) {
        clearInterval(this.projectileInterval);
        this.projectileInterval = null;
      }
      if (this.projectileSpawnInterval) {
        clearInterval(this.projectileSpawnInterval);
        this.projectileSpawnInterval = null;
      }
      if (this.slowTimeoutId) {
        clearTimeout(this.slowTimeoutId);
        this.slowTimeoutId = null;
      }
      if (this.bossTimers.attack) {
        clearTimeout(this.bossTimers.attack);
        this.bossTimers.attack = null;
      }
      if (this.bossTimers.rest) {
        clearTimeout(this.bossTimers.rest);
        this.bossTimers.rest = null;
      }
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      if (this.countdownIntervalId) {
        clearInterval(this.countdownIntervalId);
        this.countdownIntervalId = null;
      }
      if (this.fase5Intervalo) {
        clearInterval(this.fase5Intervalo);
        this.fase5Intervalo = null;
      }
    },
    setupControles() {
      if (this._handleKeyDown) {
        window.removeEventListener("keydown", this._handleKeyDown);
      }
      if (this._handleKeyUp) {
        window.removeEventListener("keyup", this._handleKeyUp);
      }
      this._handleKeyDown = (e) => {
        this.keysPressed[e.key] = true;
      };
      this._handleKeyUp = (e) => {
        this.keysPressed[e.key] = false;
      };
      window.addEventListener("keydown", this._handleKeyDown);
      window.addEventListener("keyup", this._handleKeyUp);
    },
    setupInimigos() {
      const size = 70;
      const padding = 50;
      if (this.faseAtualDoJogo === 5) {
        this.inimigos = [];
        this.boss = gerarBoss(this.width, this.height, 400);
        this.iniciarCicloBoss();
      } else {
        this.boss = null;
        this.inimigos = gerarInimigosPorFase(
          this.faseAtualDoJogo,
          this.width,
          this.height,
          size,
          padding
        );
      }
    },
    iniciarTimerTotal() {
      if (this.tempoTotalInterval) clearInterval(this.tempoTotalInterval);
      this.tempoTotalDeJogo = 0;
      this.tempoTotalInterval = setInterval(() => {
        if (this.state === "jogando" && !this.inGameMenuOpen) {
          this.tempoTotalDeJogo++;
        }
      }, 1000);
    },
    iniciarTimer() {
      clearInterval(this.tempoInterval);
      this.tempoInterval = setInterval(() => {
        if (this.state !== "jogando" || this.inGameMenuOpen) return;
        this.tempo++;
        if (this.tempo > 0 && this.tempo % 20 === 0 && !this.trocaFaseDelay) {
          this.trocaFaseDelay = true;
          setTimeout(() => {
            const proximaFase = this.nivel + 1;
            if (this.nivel === 1) {
              this.mostrarCutsceneFase(proximaFase);
            } else if (this.nivel === 2) {
              this.iniciarCutsceneFase3();
            } else if (this.nivel === 3) {
              this.mostrarCutsceneFase(proximaFase);
            } else if (this.nivel === 4) {
              this.mostrarCutsceneFase(proximaFase);
            }
            this.trocaFaseDelay = false;
          }, 3000);
        }
        this.pontos += 10;
      }, 1000);
    },
    iniciarLogicaFase5() {
      if (this.fase5Intervalo) clearInterval(this.fase5Intervalo);
      this.fase5Timer = 0;
      this.fase5Intervalo = setInterval(() => {
        if (this.state !== "jogando" || this.inGameMenuOpen) return;
        if (this.fase5Timer < this.fase5Duracao) {
          this.fase5Timer++;
        } else {
          this.vencerJogo();
        }
      }, 1000);
    },
    vencerJogo() {
      this.limparTimers();
      this.tempoFinal = this.tempoTotalDeJogo;
      if (this.bgMusic) this.bgMusic.pause();
      this.setState("fadeParaFinal");
      setTimeout(() => {
        this.setState("cutsceneFinal");
      }, 2000);
    },
    iniciarLoop() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      clearInterval(this.projectileInterval);
      this.projectileInterval = setInterval(() => {
        if (this.state !== "jogando" || this.inGameMenuOpen) return;
        if (Math.random() < 0.05) {
          this.powerUps.push({
            x: Math.random() * this.width,
            y: -50,
            r: 20,
            type: Math.random() < 0.5 ? "life" : "slow",
            rotation: 0,
          });
        }
      }, 300);
      clearInterval(this.projectileSpawnInterval);
      this.projectileSpawnInterval = setInterval(() => {
        if (this.state !== "jogando" || this.inGameMenuOpen) return;
        const config = {
          player: this.player,
          slowAtivo: this.slowAtivo,
          velocidadeProjeteis:
            this.velocidadeProjeteisPorFase[this.faseAtualDoJogo],
          imagens: this.imagens,
          projectiles: this.projectiles,
        };
        if (this.faseAtualDoJogo < 5) {
          this.inimigos.forEach((inimigo) =>
            atirarProjeteis(
              { ...config, atirador: inimigo },
              {
                velocidadeMultiplicador: 1,
                width: this.projectileSize,
                height: this.projectileSize,
              }
            )
          );
        } else if (this.boss && this.bossState === "attacking") {
          atirarProjeteis(
            { ...config, atirador: this.boss },
            {
              velocidadeMultiplicador: 2,
              width: this.projectileSize,
              height: this.projectileSize,
            }
          );
        }
      }, 700);
      cancelAnimationFrame(this.animationId);
      this.animate(ctx);
    },
    animate(ctx) {
      if (this.state !== "jogando" || this.inGameMenuOpen) {
        cancelAnimationFrame(this.animationId);
        return;
      }
      ctx.clearRect(0, 0, this.width, this.height);
      if (this.faseAtualDoJogo !== 5) {
        if (this.fundoAtual) {
          ctx.drawImage(this.fundoAtual, 0, 0, this.width, this.height);
        }
      }
      const speed = 5;
      const playerRadius = this.player.hitboxRadius;
      let newPlayerX = this.player.x;
      let newPlayerY = this.player.y;
      if (this.keysPressed["w"] || this.keysPressed["W"]) {
        newPlayerY -= speed;
      }
      if (this.keysPressed["s"] || this.keysPressed["S"]) {
        newPlayerY += speed;
      }
      if (this.keysPressed["a"] || this.keysPressed["A"]) {
        newPlayerX -= speed;
      }
      if (this.keysPressed["d"] || this.keysPressed["D"]) {
        newPlayerX += speed;
      }
      const isCollidingWithWalls = verificarColisaoDePixel(
        this.collisionCtx,
        newPlayerX,
        newPlayerY,
        playerRadius,
        this.width,
        this.height
      );
      if (!isCollidingWithWalls) {
        this.player.x = newPlayerX;
        this.player.y = newPlayerY;
      }
      const metadePlayer = this.player.size / 2;
      this.player.x = Math.max(
        metadePlayer,
        Math.min(this.width - metadePlayer, this.player.x)
      );
      this.player.y = Math.max(
        metadePlayer,
        Math.min(this.height - metadePlayer, this.player.y)
      );
      if (this.imagens.player) {
        drawImage(
          ctx,
          this.imagens.player,
          this.player.x,
          this.player.y,
          this.player.size,
          this.player.size
        );
      }
      if (this.faseAtualDoJogo < 5) {
        this.processarInimigos(ctx);
      } else {
        this.processarBoss(ctx);
      }
      this.processarProjetiles(ctx);
      this.processarPowerUps(ctx);
      this.animationId = requestAnimationFrame(() => this.animate(ctx));
    },
    processarBoss(ctx) {
      if (this.bossState === "attacking") {
        this.moverBoss();
      }
      if (!this.boss) return;
      const bossImage =
        this.bossState === "sleeping"
          ? this.imagens.boss_sleeping
          : this.imagens.boss;
      if (bossImage) {
        drawImage(
          ctx,
          bossImage,
          this.boss.x,
          this.boss.y,
          this.boss.size,
          this.boss.size,
          0
        );
      }
    },
    iniciarCicloBoss() {
      if (!this.boss) return;
      this.bossState = "attacking";
    },
    processarInimigos(ctx) {
      this.inimigos.forEach((inimigo, index) => {
        const spriteIndex = (index % 6) + 1;
        const img = this.imagens["inimigo" + spriteIndex];
        if (img) {
          drawImage(
            ctx,
            img,
            inimigo.x,
            inimigo.y,
            inimigo.size,
            inimigo.size,
            0
          );
        }
      });
    },
    processarProjetiles(ctx) {
      this.projectiles = this.projectiles.filter((p) => {
        p.x += p.xVel;
        p.y += p.yVel;
        if (
          p.x < -50 ||
          p.y < -50 ||
          p.x > this.width + 50 ||
          p.y > this.height + 50
        ) {
          return false;
        }
        if (
          verificarColisaoDeProjetilComPlayer(
            p.x,
            p.y,
            p.r,
            this.player.x,
            this.player.y,
            this.player.hitboxRadius
          )
        ) {
          this.vidas--;
          if (this.vidas <= 0) {
            this.setState("morte");
            this.limparTimers();
          }
          return false;
        }
        p.rotation = (p.rotation || 0) + 0.05;
        if (p.img) {
          drawImage(ctx, p.img, p.x, p.y, p.width, p.height, p.rotation);
        }
        return true;
      });
    },
    processarPowerUps(ctx) {
      this.powerUps = this.powerUps.filter((pu) => {
        pu.y += 2;
        if (
          verificarColisaoDeProjetilComPlayer(
            pu.x,
            pu.y,
            pu.r,
            this.player.x,
            this.player.y,
            this.player.hitboxRadius
          )
        ) {
          this.coletarPowerUp(pu);
          return false;
        }
        const img = pu.type === "life" ? this.imagens.vida : this.imagens.slow;
        const size = 50;
        pu.rotation = (pu.rotation || 0) + 0.03;
        if (img) {
          drawImage(ctx, img, pu.x, pu.y, size, size, pu.rotation);
        }
        return pu.y <= this.height + 50;
      });
    },
    coletarPowerUp(powerUp) {
      if (powerUp.type === "life") {
        this.vidas++;
        this.pontos += 50;
      } else if (powerUp.type === "slow") {
        this.slowAtivo = true;
        this.pontos += 20;
        if (this.slowTimeoutId) {
          clearTimeout(this.slowTimeoutId);
        }
        this.slowTimeoutId = setTimeout(() => {
          this.slowAtivo = false;
          this.slowTimeoutId = null;
        }, 5000);
      }
    },
    moverBoss() {
      if (!this.boss) return;
      this.boss.x += this.bossDirecaoX * (this.boss.velocidade * 0.75);
      this.boss.y += this.bossDirecao * this.boss.velocidade;
      const halfSize = this.boss.size / 2;
      if (
        this.boss.y + halfSize > this.height - 50 ||
        this.boss.y - halfSize < 50
      ) {
        this.bossDirecao *= -1;
      }
      if (this.boss.x + halfSize > this.width || this.boss.x - halfSize < 0) {
        this.bossDirecaoX *= -1;
      }
    },
    updateVolume(type, value) {
      if (type === "musica") {
        this.volumeMusica = parseInt(value);
        if (this.bgMusic) {
          this.bgMusic.volume = this.volumeMusica / 100;
        }
      }
    },
    toggleGameMenu() {
      this.inGameMenuOpen = !this.inGameMenuOpen;
      if (this.inGameMenuOpen) {
        this.limparTimers();
      } else {
        this.iniciarLoop();
        this.iniciarTimer();

        if (this.faseAtualDoJogo === 5) {
          this.iniciarLogicaFase5();
        }
      }
    },
    pularFase() {
      if (this.nivel >= 5) return;
      this.inGameMenuOpen = false;
      const proximaFase = this.nivel + 1;
    
      if (proximaFase === 3) {
        this.iniciarCutsceneFase3(); 
      } else {
        this.mostrarCutsceneFase(proximaFase);
      }
    },
    voltarAoMenuPrincipal() {
      this.inGameMenuOpen = false;
      setTimeout(() => {
        this.setState("menu");
        this.limparTimers();
        this.resetarEstadoDoJogo();
        if (this.bgMusic) {
          this.bgMusic.currentTime = 0;
          this.bgMusic
            .play()
            .catch((e) =>
              console.warn(
                "Erro ao tocar música ao voltar ao menu principal:",
                e
              )
            );
        }
      }, 500);
    },
  },

  beforeUnmount() {
    if (this._handleKeyDown) {
      window.removeEventListener("keydown", this._handleKeyDown);
    }
    if (this._handleKeyUp) {
      window.removeEventListener("keyup", this._handleKeyUp);
    }
    this.limparTimers();
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic = null;
    }
  },
};
</script>