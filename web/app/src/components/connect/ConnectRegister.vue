<template>
  <div class="connect-register f-col">
    <h1 class="connect-title" v-html="ts('connect.register')"></h1>
    <div class="connect-text">
      {{ ts('connect.register_text') }}
    </div>
    <CTInput
      v-model="email"
      type="email"
      class="input email-input"
      :placeholder="ts('email')"
      :isDisabled="loading"
    />
    <PasswordInput
      v-model="password"
      class="input password-input"
      :placeholder="ts('password')"
      :isDisabled="loading"
      @handleEnter="emit('register', { email, password })"
    />
    <ErrorMessage :error="errorKey && ts(errorKey)" class="connect-error" />
    <div class="register-buttons">
      <CTButton
        :text="ts('connect.register')"
        :animate="loading"
        class="button2"
        @click="emit('register', { email, password })"
      />
      <CTButton
        :text="ts('go_back')"
        :animate="false"
        class="button2 button-cancel"
        @click="emit('back')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ts } from '../../i18n'
import CTButton from '../widgets/CTButton.vue'
import PasswordInput from '../widgets/PasswordInput.vue'
import CTInput from '../widgets/CTInput.vue'
import { IRegisterEmailPassword } from '@app/types'
import ErrorMessage from '../widgets/ErrorMessage.vue'

const email = ref('')
const password = ref('')

const emit = defineEmits<{
  (e: 'register', data: IRegisterEmailPassword): void
  (e: 'back'): void
}>()
defineProps<{
  loading: boolean
  errorKey?: string
}>()
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.connect-register {
  max-width: 900px;
  margin: 0 auto;
}

.connect-text {
  @mixin text 16px;
  margin: 16px auto 0;
  max-width: 420px;
  text-align: center;
}
.button2 {
  width: 120px;
  text-align: center;
}
.register-buttons {
  display: flex;
  margin: 24px auto 0;
}
.button-cancel {
  margin-left: 16px;
}
.input {
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
}
.email-input {
  margin-top: 32px;
}
.password-input {
  margin-top: 12px;
}
</style>
