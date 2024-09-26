<template>
  <header>
    <div class="header">
      <router-link :to="{ name: 'Home' }">
        <Logo class="header-logo" />
      </router-link>
      <div class="links">
        <HeaderLink to="Back" :text="ts('back.title')" />
        <HeaderLink to="Services" :text="ts('services.title')" />
        <HeaderLink to="How" :text="ts('how.title')" />
      </div>
      <router-link :to="{ name: 'Connect' }" class="join-link">
        <div class="join button1">
          {{ ts('connect.join') }}
        </div>
      </router-link>
      <Burger @click="rightActive = true" />
      <Drawer :active="rightActive" @close="rightActive = false">
        <DrawerLink to="Back" :text="ts('back.title')" @click="rightActive = false" />
        <DrawerLink
          to="Services"
          :text="ts('services.title')"
          @click="rightActive = false"
        />
        <DrawerLink to="How" :text="ts('how.title')" @click="rightActive = false" />
      </Drawer>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ts } from '../../i18n'
import Logo from '../svg/Logo.vue'
import Burger from '../widgets/Burger.vue'
import Drawer from './Drawer.vue'
import DrawerLink from './DrawerLink.vue'
import HeaderLink from './HeaderLink.vue'

const rightActive = ref(false)
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

header {
  width: 100%;
  position: relative;
  z-index: 1;
}
.header {
  @mixin text 16px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 64px 20px 24px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.header-logo {
  width: 178px;
}
.links {
  display: flex;
  margin-left: auto;
  align-items: center;
}
.join {
  margin-left: 24px;
}
.burger {
  display: none;
  margin-left: auto;
}
@media (max-width: 860px) {
  .header {
    padding-top: 40px;
  }
  .header-logo {
    width: 140px;
  }
  .links a {
    margin: 0 12px;
  }
}
@media (max-width: 680px) {
  .links {
    display: none;
  }
  .join-link {
    margin-left: auto;
    margin-right: 16px;
  }
  .burger {
    display: flex;
  }
}
</style>
