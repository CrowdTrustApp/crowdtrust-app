<template>
  <div class="switch-wallet">
    <div v-if="!signMode" class="switch-connect">
      <div class="current">
        {{ ethDisplay }}
      </div>
      <div class="switch-text">
        {{ ts('profile.switch') }}
      </div>
      <ErrorMessage
        v-if="errorKey || authErrorKey"
        :error="ts(errorKey || authErrorKey)"
        class="switch-error"
      />
      <div class="switch-buttons">
        <div class="cancel" @click="emit('cancel')">
          {{ ts('cancel') }}
        </div>
        <CTButton :text="ts('connect.button')" class="switch-button" @click="connect" />
      </div>
    </div>
    <div v-else class="switch-sign">
      <div class="current">
        {{ ethDisplay }}
      </div>
      <div class="switch-text">
        {{ ts('profile.sign') }}
      </div>
      <ErrorMessage
        v-if="errorKey || authErrorKey"
        :error="ts(errorKey || authErrorKey)"
        class="switch-error"
      />
      <CTButton
        :text="ts('confirm')"
        :loading="signing"
        class="switch-button"
        @click="sign"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useChain } from '@samatech/vue3-eth'
import { store } from '@app/store'
import { ts } from '../../i18n'
import CTButton from '../widgets/CTButton.vue'
import { authErrorKey, updateUser, userExists } from '@app/features'
import ErrorMessage from '../widgets/ErrorMessage.vue'
import { IUpdateUserApiRequest } from '@app/types'
import { ethSwitchMessage } from '@app/util'

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const { walletConnected, wallets, connectWallet, getSigner } = useChain()

const loading = ref(false)
const signing = ref(false)
const newAddress = ref()
const errorKey = ref()
const signMode = ref(false)

const ethDisplay = computed(() => {
  const addr = newAddress.value || store.user.ethAddress.value
  if (addr) {
    return `${addr.slice(0, 6)}...${addr.slice(addr.length - 4, addr.length)}`
  }
  return ''
})

const sign = async () => {
  errorKey.value = undefined
  const signer = getSigner()
  signing.value = true
  if (signer) {
    const msg = ethSwitchMessage(newAddress.value)
    const signature = await signer.signMessage(msg)
    console.log('SIGNED')
    const payload: IUpdateUserApiRequest = {
      eth_address: newAddress.value,
      eth_address_signature: signature,
    }
    await updateUser(payload, errorKey)
    signing.value = false
    if (!errorKey.value) {
      emit('cancel')
    }
  } else {
    errorKey.value = 'errors.signer'
  }
}

const connect = async () => {
  errorKey.value = undefined
  loading.value = true
  await connectWallet('metamask')
  const wallet = wallets.value[0]
  if (walletConnected.value && wallet) {
    const exists = await userExists(wallet)
    if (!authErrorKey.value) {
      if (exists) {
        errorKey.value = 'errors.EthAddressUnique'
      } else {
        signMode.value = true
        newAddress.value = wallet
      }
    }
  }
  loading.value = false
}
</script>

<style lang="postcss" scoped>
@import '../../css/defines.postcss';

.switch-wallet {
  max-width: 240px;
  text-align: center;
}
.current {
  @mixin semibold 15px;
}
.switch-text {
  @mixin text 14px;
  margin-top: 6px;
}
.switch-buttons {
  display: flex;
  align-items: center;
  margin-top: 16px;
}
</style>
