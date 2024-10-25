<template>
  <div class="settings-wrap">
    <SettingsRow :title="ts('email')" :text="ts('profile.email_text')">
      <template #right>
        <div v-if="emailUpdate" class="email-right f-col">
          <CTInput v-model="newEmail" :placeholder="ts('profile.new_email')" />
          <ErrorMessage :error="errorKey && ts(errorKey)" />
          <div class="update-buttons">
            <div class="email-cancel cancel" @click="emailUpdate = false">
              {{ ts('cancel') }}
            </div>
            <CTButton
              :text="ts('save')"
              :animate="saving"
              class="email-button settings-button"
              @click="saveEmail"
            />
          </div>
        </div>
        <div v-else class="email-right f-col">
          <span class="email">{{ email }}</span>
          <CTButton
            :text="ts('profile.update_email')"
            class="email-button settings-button"
            :disabled="passwordUpdate || walletUpdate"
            @click="showEmailUpdate"
          />
        </div>
      </template>
    </SettingsRow>
    <SettingsRow :title="ts('password')" :text="ts('profile.password_text')">
      <template #right>
        <div v-if="passwordUpdate" class="password-right f-col">
          <PasswordInput
            v-model="oldPassword"
            :placeholder="ts('profile.old_password')"
            class="password-input"
          />
          <PasswordInput
            v-model="newPassword"
            :placeholder="ts('profile.new_password')"
            class="password-input"
          />
          <PasswordInput
            v-model="confirmPassword"
            :placeholder="ts('profile.confirm_password')"
            class="password-input"
          />
          <ErrorMessage :error="errorKey && ts(errorKey)" />
          <div class="update-buttons">
            <div class="password-cancel cancel" @click="passwordUpdate = false">
              {{ ts('cancel') }}
            </div>
            <CTButton
              :text="ts('save')"
              :animate="saving"
              class="password-button settings-button"
              @click="savePassword"
            />
          </div>
        </div>
        <div v-else class="password-right f-col">
          <CTButton
            :text="ts('profile.update_password')"
            :disabled="emailUpdate || walletUpdate"
            class="settings-button"
            @click="showPasswordUpdate"
          />
        </div>
      </template>
    </SettingsRow>
    <SettingsRow :title="ts('wallet')" :text="ts('profile.wallet_text')">
      <template #right>
        <SwitchWallet
          v-if="walletUpdate"
          class="wallet-right f-col"
          @cancel="walletUpdate = false"
        />
        <div v-else class="wallet-right f-col">
          <CTButton
            :text="ts('profile.update_wallet')"
            :disabled="emailUpdate || passwordUpdate"
            class="settings-button"
            @click="walletUpdate = true"
          />
        </div>
      </template>
    </SettingsRow>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import CTButton from '../widgets/CTButton.vue'
import { ts } from '../../i18n'
import SettingsRow from './SettingsRow.vue'
import { store } from '@app/store'
import CTInput from '../widgets/CTInput.vue'
import { IUpdateUserApiRequest } from '@app/types'
import { updateUser } from '@app/features'
import ErrorMessage from '../widgets/ErrorMessage.vue'
import PasswordInput from '../widgets/PasswordInput.vue'
import SwitchWallet from './SwitchWallet.vue'

const emailUpdate = ref(false)
const passwordUpdate = ref(false)
const walletUpdate = ref(false)

const newEmail = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const errorKey = ref()

const email = computed(() => {
  return store.user.email.value || 'No email'
})

const showEmailUpdate = () => {
  errorKey.value = undefined
  emailUpdate.value = true
  newEmail.value = store.user.email.value || ''
}

const saveEmail = async () => {
  const payload: IUpdateUserApiRequest = {
    email: newEmail.value,
  }
  saving.value = true
  await updateUser(payload, errorKey)
  saving.value = false
  if (!errorKey.value) {
    emailUpdate.value = false
  }
}

const showPasswordUpdate = () => {
  errorKey.value = undefined
  passwordUpdate.value = true
}

const savePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorKey.value = 'errors.confirm_password'
    return
  }
  const payload: IUpdateUserApiRequest = {
    old_password: oldPassword.value,
    new_password: newPassword.value,
  }
  saving.value = true
  await updateUser(payload, errorKey)
  saving.value = false
  if (!errorKey.value) {
    passwordUpdate.value = false
  }
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.settings-wrap {
  min-height: 240px;
}
.email {
  @mixin text 15px;
  text-align: right;
  margin-bottom: 12px;
}
.settings-button {
  width: 172px;
}
.update-buttons {
  display: flex;
  align-items: center;
  margin-top: 16px;
}
.password-input {
  margin-bottom: 8px;
}
</style>
