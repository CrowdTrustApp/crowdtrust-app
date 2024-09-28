<template>
  <div ref="rowRef" class="services-row" :class="{ reverse, active }">
    <ServicesText :icon="icon" :title="title" :text="text" />
    <ServicesImage :image="image" />
  </div>
</template>

<script lang="ts" setup>
import ServicesText from './ServicesText.vue'
import ServicesImage from './ServicesImage.vue'
import { computed, onMounted, ref } from 'vue'

const { yPos } = defineProps<{
  icon: string
  title: string
  text: string
  image: string
  reverse?: boolean
  yPos: number
}>()

const rowRef = ref()
const rowY = ref()

const active = computed(() => {
  if (rowY.value) {
    const triggerY = rowY.value - window.screen.height * 0.5
    if (yPos > triggerY) {
      return true
    }
  }
  return false
})

onMounted(() => {
  const rect = rowRef.value.getBoundingClientRect()
  rowY.value = rect.top
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.services-row {
  display: flex;
  flex-direction: row;
  max-width: 1200px;
  width: 100%;
  margin: 96px auto 0;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-400px);
  &.reverse {
    flex-direction: row-reverse;
    transform: translateX(400px);
  }
  &.active {
    transform: translateX(0);
    opacity: 1;
  }
}
@media (max-width: 600px) {
  .services-row {
    flex-direction: column-reverse;
    align-items: center;
    margin-top: 64px;
    &.reverse {
      flex-direction: column-reverse;
    }
  }
}
</style>
