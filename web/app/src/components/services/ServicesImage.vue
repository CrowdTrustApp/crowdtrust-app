<template>
  <div class="services-image">
    <img :src="image" />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  image: string
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.services-image {
  box-shadow: 2px 2px 20px 3px #00000040;
  border-radius: 12px;
  height: 320px;
  width: 40%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    object-fit: cover;
  }
}
@media (max-width: 800px) {
  .services-image {
    height: 256px;
  }
}
@media (max-width: 600px) {
  .services-image {
    height: 210px;
    width: 60%;
  }
}
</style>
