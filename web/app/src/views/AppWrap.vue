<template>
  <AppHeader />
  <div id="scroll-container" class="app-content">
    <router-view class="app-router-view" />
    <CTFooter />
  </div>
</template>

<script lang="ts" setup>
import AppHeader from '../components/nav/AppHeader.vue'
import CTFooter from '../components/nav/CTFooter.vue'
</script>
