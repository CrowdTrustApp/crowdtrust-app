<template>
  <div class="services-row" :class="{ reverse }">
    <ServicesText :icon="icon" :title="title" :text="text" />
    <ServicesImage :image="image" />
  </div>
</template>

<script lang="ts" setup>
import ServicesText from './ServicesText.vue'
import ServicesImage from './ServicesImage.vue'

defineProps<{
  icon: string
  title: string
  text: string
  image: string
  reverse?: boolean
}>()
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
  &.reverse {
    flex-direction: row-reverse;
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
