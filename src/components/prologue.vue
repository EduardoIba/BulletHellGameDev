<template>
  <transition name="fade">
    <div class="historinha" @click="avancarVideoHistorinha">
      <video
        ref="videoPlayer"
        :src="videos[index]"
        autoplay
        muted
        playsinline
        @ended="avancarVideoHistorinha"
        class="video-player"
      ></video>
      <button
        v-if="index < videos.length - 1"
        class="skip-intro-button"
        @click.stop="pularVideoHistorinha"
      >
        Pular história
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Prologue",
  props: {
    videos: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    avancarVideoHistorinha: {
      type: Function,
      required: true,
    },
    pularVideoHistorinha: {
      type: Function,
      required: true,
    },
  },
};
</script>
