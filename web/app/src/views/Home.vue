<template>
  <div class="home-wrap">
    <HomeHero />
    <HomeWelcome />
    <HomeWhy />
    <HomeJoin />
    <HomeStart />
  </div>
</template>

<script lang="ts" setup>
import HomeHero from '../components/home/HomeHero.vue'
import HomeJoin from '../components/home/HomeJoin.vue'
import HomeStart from '../components/home/HomeStart.vue'
import HomeWelcome from '../components/home/HomeWelcome.vue'
import HomeWhy from '../components/home/HomeWhy.vue'
</script>

<style lang="postcss" scoped>
.home-wrap {
  padding-bottom: 140px;
}
@media (max-width: 800px) {
  .home-wrap {
    padding-bottom: 40px;
  }
}
</style>
