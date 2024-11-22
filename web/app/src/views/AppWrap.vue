<template>
  <HomeBg />
  <AppHeader />
  <div id="scroll-container" class="app-content">
    <router-view class="app-router-view" />
    <CTFooter />
  </div>
  <AppToast />
</template>

<script lang="ts" setup>
import HomeBg from '../components/home/HomeBg.vue'
import AppHeader from '../components/nav/AppHeader.vue'
import CTFooter from '../components/nav/CTFooter.vue'

import '@vuepic/vue-datepicker/dist/main.css'
import AppToast from '../components/widgets/AppToast.vue'
</script>
