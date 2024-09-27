<template>
  <div class="connect-welcome f-col">
    <h1 class="connect-title" v-html="ts('connect.title')"></h1>
    <div class="connect-text">
      {{ ts('connect.text') }}
    </div>
    <CTButton
      :text="ts('connect.button')"
      :animate="loadingAccount"
      class="button2"
      @click="emit('connect')"
    />
    <div class="how">
      {{ ts('connect.how') }}
    </div>
    <ol class="how-items">
      <li v-html="ts('connect.install')"></li>
      <li>{{ ts('connect.click') }}</li>
      <li>{{ ts('connect.email') }}</li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { ts } from '../../i18n'
import CTButton from '../widgets/CTButton.vue'

defineProps<{
  loadingAccount: boolean
}>()

const emit = defineEmits<{
  (e: 'connect'): void
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

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
