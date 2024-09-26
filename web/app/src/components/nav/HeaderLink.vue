<template>
  <router-link :to="{ name: to }" class="header-link f-col" :class="{ active }">
    {{ text }}
    <div class="line"></div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const { to } = defineProps<{
  to: string
  text: string
}>()

const active = computed(() => {
  return route.name === to
})
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.line {
  background-color: rgb(26, 170, 226);
  height: 1px;
  width: 35px;
  opacity: 0;
  margin-top: 4px;
  transition: opacity 0.25s ease;
}
.header-link {
  color: black;
  margin: 0 24px;
  transition: color 0.25s ease;
  align-items: center;
  &.active {
    pointer-events: none;
    cursor: default;
    .line {
      opacity: 1;
    }
  }
  &:hover {
    color: $blue3;
    .line {
      opacity: 1;
    }
  }
}
</style>
