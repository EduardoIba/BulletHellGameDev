export function iniciarCutsceneVideos() {
  function mostrarCutsceneFase(ctx, proximaFase) {
    const cutsceneInfo = ctx.cutsceneFaseMap[proximaFase];
    if (cutsceneInfo && !ctx.cutscenesFaseJaVistas[proximaFase]) {
      ctx.setState("cutsceneFase");
      ctx.currentCutsceneFaseIndex = cutsceneInfo.startIndex;
      ctx.nextFaseAfterCutscene = proximaFase;
      ctx.limparTimers();
      ctx.$nextTick(() => {
        const videoPlayerFase = ctx.$refs.videoPlayerFase;
        if (videoPlayerFase) {
          videoPlayerFase.load();
          videoPlayerFase
            .play()
            .catch((e) => console.warn("Erro ao tocar vídeo da cutscene:", e));
        }
      });
    } else {
      ctx.iniciarContagemRegressiva(proximaFase);
    }
  }
  function iniciarCutsceneFase3(ctx) {
    const videoPlayerFase3 = ctx.$refs.videoPlayerFase3;
    if (videoPlayerFase3) {
      videoPlayerFase3.play();
    }
  }

  function iniciarCutsceneFinal(ctx) {
    const videoPlayerFinal = ctx.$refs.videoMortePlayer;
    if (videoPlayerFinal) {
      videoPlayerFinal.play();
    }
  }

  return {
    mostrarCutsceneFase,
    iniciarCutsceneFase3,
    iniciarCutsceneFinal,
  };
}
