<template>
  <HomeBg />
  <HomeHeader />
  <div id="scroll-container" class="app-content">
    <router-view class="app-router-view" />
    <CTFooter />
  </div>
</template>

<script lang="ts" setup>
import HomeHeader from '../components/nav/HomeHeader.vue'
import CTFooter from '../components/nav/CTFooter.vue'
import HomeBg from '../components/home/HomeBg.vue'
</script>

<style lang="postcss" scoped></style>
