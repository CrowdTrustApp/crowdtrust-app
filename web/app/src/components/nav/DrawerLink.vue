<template>
  <router-link :to="{ name: to }" class="drawer-link">
    {{ text }}
  </router-link>
</template>

<script lang="ts" setup>
defineProps<{
  to: string
  text: string
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.drawer-link {
  border-bottom: 1px solid $border1;
  font-size: 24px;
  padding: 16px 0;
  max-width: 530px;
  margin: 0 auto;
  color: black;
  width: 100%;
  text-align: center;
}
</style>
