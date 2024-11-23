<template>
  <HomeBg />
  <AppHeader />
  <div id="scroll-container" class="app-content">
    <div v-if="notAdmin" class="not-found f-col">
      {{ ts('not_found') }}
    </div>
    <router-view v-else class="app-router-view" />
    <CTFooter />
  </div>
  <AppToast />
</template>

<script lang="ts" setup>
import 'vue3-carousel/dist/carousel.css'
import HomeBg from '../components/home/HomeBg.vue'
import AppHeader from '../components/nav/AppHeader.vue'
import CTFooter from '../components/nav/CTFooter.vue'

import '@vuepic/vue-datepicker/dist/main.css'
import AppToast from '../components/widgets/AppToast.vue'
import { onMounted, ref } from 'vue'
import { store } from '@app/store'
import { ts } from '../i18n'

const notAdmin = ref(true)

onMounted(() => {
  notAdmin.value = !store.user.isAdmin.value
})
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.not-found {
  @mixin semibold 24px;
  color: $text3;
  min-height: 400px;
  padding-top: 120px;
  align-items: center;
}
</style>
