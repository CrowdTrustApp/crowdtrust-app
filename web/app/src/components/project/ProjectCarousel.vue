<template>
  <Carousel class="project-gallery" v-bind="galleryConfig" v-model="currentSlide">
    <Slide v-for="image in images" :key="image.id">
      <img class="carousel-image" :src="urlFromAsset(image)" />
    </Slide>
  </Carousel>

  <Carousel
    class="thumbnails"
    :itemsToShow="4.5"
    :height="60"
    :wrapAround="images.length > 4"
    :gap="10"
    v-model="currentSlide"
  >
    <Slide v-for="(image, index) in images" :key="`thumb_${image.id}`">
      <div class="carousel-thumb" @click="slideTo(index)">
        <img class="carousel-image" :src="urlFromAsset(image)" />
      </div>
    </Slide>

    <template #addons>
      <Navigation />
    </template>
  </Carousel>
</template>

<script lang="ts" setup>
import { IProjectViewModel } from '@app/types'
import { orderedAssets, urlFromAsset } from '@app/util'
import { computed, ref } from 'vue'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

const { project } = defineProps<{
  project: IProjectViewModel
}>()

const images = computed(() => {
  return orderedAssets(project.assets ?? [], project.assets_order)
})

const currentSlide = ref(0)

const slideTo = (nextSlide: number) => (currentSlide.value = nextSlide)

const galleryConfig = {
  itemsToShow: 1,
  height: 340,
  mouseDrag: true,
  touchDrag: true,
  wrapAround: true,
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carousel-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumbnails {
  margin-top: 10px;
  cursor: pointer;
  --vc-nav-width: 40px;
  --vc-nav-height: 50px;
  :deep(.carousel__prev) {
    left: -10px;
  }
  :deep(.carousel__icon) {
    stroke: white;
    stroke-width: 0.8;
  }
}
</style>
