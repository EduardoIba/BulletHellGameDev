export function avancarVideoCutscenes() {
  function avancarVideoCutscenefase(ctx) {
    const cutsceneInfo = ctx.cutsceneFaseMap[ctx.nextFaseAfterCutscene];
    if (cutsceneInfo && ctx.currentCutsceneFaseIndex < cutsceneInfo.endIndex) {
      ctx.currentCutsceneFaseIndex++;
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
      ctx.cutscenesFaseJaVistas[ctx.nextFaseAfterCutscene] = true;
      ctx.iniciarContagemRegressiva(ctx.nextFaseAfterCutscene);
    }
  }

  function avancarVideoCutsceneFase3(ctx) {
    if (ctx.currentCutsceneFase3Index < ctx.videosFase3.length - 1) {
      ctx.currentCutsceneFase3Index++;
      ctx.$nextTick(() => {
        const videoPlayerFase3 = ctx.$refs.videoPlayerFase3;
        if (videoPlayerFase3) {
          videoPlayerFase3.load();
          videoPlayerFase3
            .play()
            .catch((e) =>
              console.warn("Erro ao tocar vídeo da cutscene da Fase 3:", e)
            );
        }
      });
    } else {
      ctx.cutsceneFase3JaVista = true;
      ctx.iniciarContagemRegressiva(3);
    }
  }

  function avancarVideoFinal(ctx) {
    if (ctx.currentCutsceneFinalIndex < ctx.videosFinais.length - 1) {
      ctx.currentCutsceneFinalIndex++;
      ctx.$nextTick(() => {
        const videoPlayerFinal = ctx.$refs.videoPlayerFinal;
        if (videoPlayerFinal) {
          videoPlayerFinal.load();
          videoPlayerFinal
            .play()
            .catch((e) =>
              console.warn("Erro ao tocar próximo vídeo final:", e)
            );
        }
      });
    } else {
      ctx.setState("telaFinal");
    }
  }

  function avancarVideoHistorinha(ctx) {
    if (ctx.videoIndex < ctx.videosHistorinha.length - 1) {
      ctx.videoIndex++;
    } else {
      ctx.historinhaJaVista = true;
      ctx.iniciarGameplay(ctx.faseAtualDoJogo);
    }
  }

  return {
    avancarVideoCutscenefase,
    avancarVideoCutsceneFase3,
    avancarVideoFinal,
    avancarVideoHistorinha,
  };
}
