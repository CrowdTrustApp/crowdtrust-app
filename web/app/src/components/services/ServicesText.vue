<template>
  <div class="services-text">
    <div class="text-wrap f-col">
      <img :src="icon" class="services-icon" />
      <div class="title">
        {{ title }}
      </div>
      <div class="text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  icon: string
  title: string
  text: string
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.services-text {
  width: 40%;
  height: 320px;
}
.services-icon {
  width: 80px;
  height: 80px;
}
.text-wrap {
  margin: 0 auto;
  max-width: 384px;
  padding: 0 24px;
  justify-content: center;
  height: 100%;
}
.title {
  @mixin title 24px;
  font-weight: 800;
  color: $blue3;
  margin-top: 6px;
}
.text {
  @mixin text 16px;
  color: rgb(51, 51, 51);
  margin-top: 8px;
}
@media (max-width: 600px) {
  .services-text {
    width: 60%;
    height: auto;
    margin-top: 64px;
  }
  .text-wrap {
    align-items: center;
    text-align: center;
  }
}
</style>
