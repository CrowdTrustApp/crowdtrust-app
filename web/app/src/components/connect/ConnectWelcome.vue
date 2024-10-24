<template>
  <div class="connect-welcome f-col">
    <h1 class="connect-title" v-html="ts('connect.title')"></h1>
    <div class="connect-text">
      {{ ts('connect.text') }}
    </div>
    <ErrorMessage :error="errorKey && ts(errorKey)" class="connect-error" />
    <CTButton
      :text="ts('connect.button')"
      :animate="loadingAccount"
      class="button2"
      @click="emit('connect')"
    />
    <div class="email-login" @click="emit('emailLogin')">
      {{ ts('connect.email_login') }}
    </div>
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
import ErrorMessage from '../widgets/ErrorMessage.vue'

defineProps<{
  loadingAccount: boolean
  errorKey: string | undefined
}>()

const emit = defineEmits<{
  (e: 'connect'): void
  (e: 'emailLogin'): void
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.connect-welcome {
  align-items: center;
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
.connect-error {
  margin-top: 0px;
}
.email-login {
  @mixin semibold 14px;
  color: $text3;
  border-bottom: 1px solid $text3;
  margin-top: 16px;
  cursor: pointer;
  user-select: none;
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
