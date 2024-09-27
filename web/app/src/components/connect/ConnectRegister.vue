<template>
  <div class="connect-register f-col">
    <h1 class="connect-title" v-html="ts('connect.register')"></h1>
    <div class="connect-text">
      {{ ts('connect.register_text') }}
    </div>
    <CTButton
      :text="ts('connect.button')"
      :animate="loading"
      class="button2"
      @click="emit('register')"
    />
  </div>
</template>

<script setup lang="ts">
import { ts } from '../../i18n'
import CTButton from '../widgets/CTButton.vue'

const emit = defineEmits<{
  (e: 'register'): void
}>()
defineProps<{
  loading: boolean
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.connect-text {
  @mixin text 16px;
  margin: 16px auto 0;
  max-width: 420px;
  text-align: center;
}
.button2 {
  width: 120px;
  margin: 24px auto 0;
  text-align: center;
}
.how {
  @mixin title 20px;
  margin-top: 48px;
  text-align: center;
}
.how-items {
  @mixin text 18px;
  max-width: 480px;
  margin: 16px auto;
  li {
    margin-top: 12px;
  }
}
</style>
