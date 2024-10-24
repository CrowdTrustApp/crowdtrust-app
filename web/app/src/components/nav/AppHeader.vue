<template>
  <header>
    <div class="header">
      <router-link :to="{ name: 'Home' }">
        <Logo class="header-logo" />
      </router-link>
      <div class="links">
        <HeaderLink to="Back" :text="ts('back.title')" />
        <HeaderLink to="Services" :text="ts('services.title')" />
        <HeaderLink to="Projects" :text="ts('projects.title')" />
      </div>
      <CTUserMenu v-if="loggedIn" class="user-menu" />
      <router-link v-else :to="{ name: 'Connect' }" class="join-link">
        <div class="join button1">
          {{ ts('connect.join') }}
        </div>
      </router-link>
      <Burger @click="rightActive = true" />
      <Drawer :active="rightActive" @close="rightActive = false" class="header-drawer">
        <DrawerLink to="Back" :text="ts('back.title')" @click="rightActive = false" />
        <DrawerLink
          to="Services"
          :text="ts('services.title')"
          @click="rightActive = false"
        />
        <DrawerLink
          to="Projects"
          :text="ts('projects.title')"
          @click="rightActive = false"
        />
      </Drawer>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { loggedIn } from '@app/features'
import { ts } from '../../i18n'
import Logo from '../svg/Logo.vue'
import Burger from '../widgets/Burger.vue'
import Drawer from './Drawer.vue'
import DrawerLink from './DrawerLink.vue'
import HeaderLink from './HeaderLink.vue'
import CTUserMenu from './CTUserMenu.vue'

const rightActive = ref(false)
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

header {
  width: 100%;
  position: relative;
  z-index: 999;
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
.user-menu {
  margin-left: auto;
}
.burger {
  display: none;
  margin-left: 16px;
}
.header-drawer {
  display: none;
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
  .header-drawer {
    display: block;
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
