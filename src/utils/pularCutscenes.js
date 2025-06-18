export function pularCutscenesVideos() {
  function pularCutsceneFase(ctx) {
    const videoPlayerFase = ctx.$refs.videoPlayerFase;
    if (videoPlayerFase) {
      videoPlayerFase.pause();
      videoPlayerFase.currentTime = 0;
    }
    ctx.cutscenesFaseJaVistas[ctx.nextFaseAfterCutscene] = true;
    ctx.iniciarContagemRegressiva(ctx.nextFaseAfterCutscene);
  }
  function pularCutsceneFase3(ctx) {
    const videoPlayerFase3 = ctx.$refs.videoPlayerFase3;
    if (videoPlayerFase3) {
      videoPlayerFase3.pause();
      videoPlayerFase3.currentTime = 0;
    }
    ctx.cutsceneFase3JaVista = true;
    ctx.iniciarContagemRegressiva(3);
  }
  function pularCutsceneFinal(ctx) {
    const videoPlayerFinal = ctx.$refs.videoPlayerFinal;
    if (videoPlayerFinal) {
      videoPlayerFinal.pause();
      videoPlayerFinal.currentTime = 0;
    }
    ctx.setState("telaFinal");
  }
  function pularVideoHistorinha(ctx) {
    ctx.historinhaJaVista = true;
    ctx.iniciarGameplay(ctx.faseAtualDoJogo);
  }
  return {
    pularCutsceneFase,
    pularCutsceneFase3,
    pularCutsceneFinal,
    pularVideoHistorinha,
  };
}
