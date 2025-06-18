<template>
    <transition name="fade">
      <div class="gameover-screen" @click="renascer">
        <video
        ref="videoMortePlayer"
        :src="videoMorte"
        autoplay
        muted
        playsinline
        @ended="renascer"
        class="video-player"
        ></video>
      </div>
    </transition>
</template>

<script>
import { useState } from "../useState.js";

export default {
  name: "GameOverScreen",
  data() {
    return {
      videoMorte: new URL(
        "../assets/videos/videomorte.mp4",
        import.meta.url
      ),
    };
  },
  props: {
    renascer: {
      type: Function,
      required: true,
    },
  },
}
</script>
