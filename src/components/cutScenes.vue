<template>
  <transition name="fade">
    <div class="historinha" @click="avancarVideoCutsceneFase">
      <video
        ref="videoPlayerFase"
        :src="videos[index]"
        autoplay
        muted
        playsinline
        @ended="avancarVideoCutsceneFase"
        class="video-player"
      ></video>
      <button class="skip-intro-button" @click.stop="pularCutsceneFase">
        Pular História
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "CutScenes",
  props: {
    videos: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    avancarVideoCutsceneFase: {
      type: Function,
      required: true,
    },
    pularCutsceneFase: {
      type: Function,
      required: true,
    },
  },
};
</script>
