<template>
  <div class="ct-asset">
    <!--
    <div class="ct-asset" :class="{ isVideo }">
    <video
      v-if="isVideo"
      ref="videoPlayer"
      :class="{ 'hide-play-button': !showVideoControls }"
      class="ct-asset-video video-js vjs-theme-fantasy"
    >
      <source :src="url" type="video/mp4" />
    </video>
    -->
    <img v-if="asImg && url" :src="url" class="ct-asset-image" />
    <div
      v-else-if="url"
      :style="{ backgroundImage: `url(${url})` }"
      class="ct-asset-image"
    />
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      class="ct-asset-default"
    >
      <path d="M19 14a3 3 0 1 0-3-3a3 3 0 0 0 3 3Zm0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1Z" />
      <path
        d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 22H6v-6l5-5l5.59 5.59a2 2 0 0 0 2.82 0L21 19l5 5Zm0-4.83l-3.59-3.59a2 2 0 0 0-2.82 0L18 19.17l-5.59-5.59a2 2 0 0 0-2.82 0L6 17.17V6h20Z"
      />
    </svg>
  </div>
</template>

<script lang="ts" setup>
// import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { computed, ref, toRefs, onMounted, onUnmounted } from 'vue'

/*
let player: VideoJsPlayer
*/
const videoPlayer = ref<Element>()

const props = withDefaults(
  defineProps<{
    asset?: string | null
    asImg?: boolean
    contentHash?: string | number
    canPlayVideo?: boolean
  }>(),
  {
    asset: null,
    contentHash: undefined,
    canPlayVideo: true,
  },
)
const { asset, canPlayVideo, contentHash } = toRefs(props)

// const isVideo = computed(() => asset.value?.endsWith('.mp4') === true)

const url = computed(() => {
  const hash = contentHash.value
  return (asset.value ?? '') + (hash ? `?${hash}` : '')
})

// Don't show controls if the asset is an image, or they are explicitly disabled
// const showVideoControls = computed(() => isVideo.value && canPlayVideo.value)

onMounted(() => {
  /*
  if (isVideo.value) {
    const options: VideoJsPlayerOptions = {
      loop: true,
      controls: showVideoControls.value,
    }
    player = videojs(videoPlayer.value || '', options)
  }
    */
})
onUnmounted(() => {
  /*
  if (player) {
    player.dispose()
  }
  */
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.ct-asset {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: $bg-light1;
  &.isVideo {
    background-color: unset;
    align-items: flex-start;
  }
}
.ct-asset-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  object-fit: contain;
  object-position: center;
}
.ct-asset-video {
  width: 100%;
  height: 100%;
  &.hide-play-button {
    .vjs-big-play-button {
      display: none;
    }
  }
  .vjs-control-bar {
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;
  }
}
.ct-asset-default {
  width: 32px;
  height: 32px;
  fill: black;
}
</style>
