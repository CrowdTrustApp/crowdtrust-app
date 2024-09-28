<template>
  <div ref="sectionRef" class="back-section" :class="{ reversed }">
    <div class="section-left f-col" :style="animateStyle">
      <div class="section-title" v-html="title"></div>
      <div class="section-text" v-html="text"></div>
    </div>
    <img class="section-image" :src="image" :style="imgStyle" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const { yPos } = defineProps<{
  image: string
  title: string
  text: string
  yPos: number
  reversed?: boolean
}>()

const sectionRef = ref()
const sectionY = ref()

const animateStyle = computed(() => {
  if (sectionY.value !== undefined) {
    const opacity1 = 0
    const left1 = 300
    const scale1 = 0.8
    const startY = sectionY.value - window.screen.height * 0.6
    const endY = sectionY.value - window.screen.height * 0.25
    const progress = (yPos - startY) / (endY - startY)
    if (yPos < startY) {
      return { opacity: 0.1, transform: `translateX(${left1}px) scale(${scale1})` }
    } else if (yPos > endY) {
      return { opacity: 1, transform: `translateX(${0}px) scale(${1})` }
    }
    return {
      opacity: opacity1 + (1 - opacity1) * progress,
      transform: `translateX(${left1 - left1 * progress}px) scale(${scale1 + (1 - scale1) * progress})`,
    }
  }
})

const imgStyle = computed(() => {
  if (sectionY.value) {
    const endY = sectionY.value - 50
    const angle = (yPos - endY) * 0.06
    return { transform: `rotateY(${angle}deg)` }
  }
})

onMounted(() => {
  const rect = sectionRef.value.getBoundingClientRect()
  sectionY.value = rect.top
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.back-section {
  background: linear-gradient(
    113deg,
    rgba(176, 225, 245, 0.35) 0%,
    rgba(27, 170, 227, 0) 100%
  );
  border-radius: 24px;
  flex-direction: row;
  display: flex;
  width: 1000px;
  color: $text2;
  margin: 32px auto 0;
  padding: 0 0 0 100px;
  &.reversed {
    flex-direction: row-reverse;
    padding: 0 100px 0 0;
  }
}
.section-left {
  justify-content: center;
}
.section-title {
  @mixin title 54px;
  font-weight: 800;
  color: black;
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
  line-height: 1.2em;
  :deep(span) {
    color: rgb(26, 170, 226);
  }
}
.section-text {
  @mixin text 24px;
  line-height: 1.5em;
  max-width: 320px;
  width: 100%;
  margin: 8px auto;
  :deep(span) {
    font-weight: 800;
  }
}
.section-image {
  height: 543px;
  object-fit: cover;
  object-position: center;
}
@media (max-width: 1200px) {
  .back-section {
    height: 450px;
    width: 95%;
  }
  .section-left {
    width: 45%;
  }
  .section-title {
    font-size: 48px;
  }
  .section-image {
    height: auto;
    width: 55%;
  }
}
@media (max-width: 800px) {
  .back-section {
    height: 360px;
  }
  .section-title {
    font-size: 32px;
  }
  .section-text {
    font-size: 20px;
    margin-top: 12px;
  }
}
@media (max-width: 600px) {
  .back-section {
    height: auto;
    flex-direction: column-reverse;
    padding: 25px 0 75px;
    align-items: center;
    text-align: center;
    &.reversed {
      flex-direction: column-reverse;
      padding: 25px 0 75px;
    }
  }
  .section-left {
    width: 80%;
  }
  .section-title {
    margin-top: 16px;
  }
  .section-text {
    max-width: 350px;
    font-size: 18px;
  }
}
</style>
