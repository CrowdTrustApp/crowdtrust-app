<template>
  <div ref="sectionRef" class="how-section" :class="{ active }">
    <div class="how-number">
      {{ number }}
    </div>
    <div class="section-left f-col">
      <div class="section-content f-col">
        <h3 class="section-title">
          {{ title }}
        </h3>
        <div class="section-text" v-html="text"></div>
      </div>
    </div>
    <div class="section-right">
      <img :src="image" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const { yPos } = defineProps<{
  number: string
  title: string
  text: string
  image: string
  yPos: number
}>()

const sectionRef = ref()
const sectionY = ref()

const active = computed(() => {
  if (sectionY.value) {
    const triggerY = sectionY.value - window.screen.height * 0.5
    if (yPos > triggerY) {
      return true
    }
  }
  return false
})

onMounted(() => {
  const rect = sectionRef.value.getBoundingClientRect()
  sectionY.value = rect.top
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.how-section {
  display: flex;
  align-items: center;
  position: relative;
  background: linear-gradient(110deg, #ffffff 0%, rgba(255, 255, 255, 0.3) 100%);
  border-radius: 15px;
  height: 300px;
  width: 800px;
  margin: 24px auto 0;
  transition: all 0.25s ease;
  opacity: 0;
  transform: scale(1);
  &:hover {
    transform: scale(1.05);
  }
  &.active {
    opacity: 1;
  }
}
.how-number {
  @mixin title 64px;
  position: absolute;
  left: 41px;
  top: 27px;
  font-style: italic;
  color: rgb(237, 237, 237);
}
.section-left {
  justify-content: center;
  width: 50%;
  padding-left: 0 32px;
}
.section-content {
  position: relative;
  margin: 0 0 0 auto;
}
.section-title {
  @mixin title 24px;
  color: $blue3;
  max-width: 302px;
  margin: 0;
}
.section-text {
  @mixin text 16px;
  margin-top: 12px;
  line-height: 1.5em;
  max-width: 302px;
  :deep(span) {
    font-weight: 700;
  }
}
.section-right {
  width: 45%;
  height: 87%;
  img {
    width: 100%;
    height: 100%;
  }
}
@media (max-width: 900px) {
  .how-section {
    width: 85%;
  }
  .section-left {
    padding-left: 64px;
  }
}
@media (max-width: 600px) {
  .how-section {
    flex-direction: column-reverse;
    height: auto;
    width: 90%;
    justify-content: center;
    padding: 16px 0 40px;
  }
  .how-number {
    font-size: 36px;
    left: 32px;
    top: 14px;
  }
  .section-left {
    width: 100%;
    padding: 0 24px;
  }
  .section-content {
    margin: 0 auto;
    text-align: center;
  }
  .section-right {
    width: 76%;
    height: auto;
  }
  .section-title {
    max-width: 330px;
  }
  .section-text {
    max-width: 330px;
  }
}
</style>
