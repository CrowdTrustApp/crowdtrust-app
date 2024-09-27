<template>
  <div class="connect-wrap">
    <TransitionGroup name="fade">
      <ConnectWelcome
        v-if="state === 'welcome'"
        :loadingAccount="loadingAccount"
        @connect="connect"
      />
      <ConnectRegister
        v-if="state === 'register'"
        :loading="false"
        @register="register"
      />
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
type ConnectState = 'welcome' | 'register'
</script>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useChain } from '@samatech/vue3-eth'
import ConnectWelcome from '../components/connect/ConnectWelcome.vue'
import ConnectRegister from '../components/connect/ConnectRegister.vue'

const {
  walletConnected,
  wallets,
  loadingAccount,
  wrongNetwork,
  connectError,
  getBalance,
  connectWallet,
  reconnectWallet,
  disconnectWallet,
} = useChain()

const state = ref<ConnectState>('welcome')

watch(walletConnected, async (connected) => {
  if (connected) {
    // API Auth
  }
})

const connect = () => {
  connectWallet('metamask')
}

const register = async () => {}

onMounted(() => {
  reconnectWallet('metamask')
})
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.connect-wrap {
  padding: 64px 0 120px;
  position: relative;
}

:deep(.connect-title) {
  @mixin title 40px;
  margin: 0;
  text-align: center;
  font-weight: 800;
  position: relative;
  span {
    color: $blue3;
  }
}
:deep(.connect-text) {
  @mixin text 16px;
  margin: 16px auto 0;
  max-width: 420px;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
