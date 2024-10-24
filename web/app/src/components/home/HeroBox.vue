<template>
  <router-link :to="{ name: 'Project', params: { id } }" class="hero-box-wrap">
    <div class="hero-box f-col">
      <img :src="image" class="box-image overlay" />
      <div class="box-mask" />
      <div class="name">
        {{ name }}
      </div>
      <div class="goal">
        {{ `${goal}${ts('goal')}` }}
      </div>
      <div class="progress-wrap">
        <div class="progress" :style="{ width: `${Math.min(goal, 100)}%` }"></div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { ts } from '../../i18n'

defineProps<{
  id: string
  name: string
  goal: number
  image: string
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.hero-box-wrap {
  margin: 10px 6px 0 6px;
  &:first-child {
    margin-top: 48px;
  }
}
.hero-box {
  box-shadow: rgba(191, 191, 191, 0.25) 2px 2px 12px 2px;
  width: 200px;
  height: 200px;
  position: relative;
  padding: 16px 20px;
  transition: all 0.25s ease;
  top: 0;
  left: 0;
  &:hover {
    top: 4px;
    left: 4px;
  }
}
.box-image {
  object-fit: cover;
  border-radius: 16px;
}
.box-mask {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 150px;
  mix-blend-mode: multiply;
  background: linear-gradient(rgb(255, 255, 255) 0%, rgb(0, 0, 0) 100%);
  border-radius: 16px;
}
.name {
  @mixin title 18px;
  font-weight: 700;
  margin-top: auto;
  color: white;
  position: relative;
}
.goal {
  @mixin text 12px;
  color: $blue2;
  font-weight: 800;
  position: relative;
}
.progress-wrap {
  margin-top: 4px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.25);
  position: relative;
}
.progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: $blue2;
}

@media (max-width: 1100px) {
  .hero-box {
    width: 190px;
    height: 190px;
  }
}

@media (max-width: 600px) {
  .hero-box {
    width: 160px;
    height: 160px;
  }
}
</style>
