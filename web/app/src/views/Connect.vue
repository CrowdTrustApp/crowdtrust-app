<template>
  <div class="connect-wrap">
    <Transition name="fade" mode="out-in">
      <ConnectWelcome
        v-if="state === 'welcome'"
        :loadingAccount="loadingAccount"
        :errorKey="authErrorKey"
        @connect="connect"
        @emailLogin="setState('loginEmail')"
      />
      <ConnectRegister
        v-else-if="state === 'register'"
        :loading="registering"
        :errorKey="authErrorKey"
        @register="register"
        @back="setState('welcome')"
      />
      <ConnectEmailLogin
        v-else-if="state === 'loginEmail'"
        :loading="loggingIn"
        :errorKey="authErrorKey"
        @login="login"
        @back="setState('welcome')"
      />
    </Transition>
  </div>
</template>

<script lang="ts">
type ConnectState = 'welcome' | 'register' | 'registerSign' | 'loginEmail' | 'loginSign'
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useChain } from '@samatech/vue3-eth'
import { authErrorKey, loginUser, registerUser, userExists } from '@app/features'
import { useLoginRedirect } from '@app/util-app'
import { ILoginUserApiRequest, IRegisterEmailPassword } from '@app/types'
import ConnectWelcome from '../components/connect/ConnectWelcome.vue'
import ConnectRegister from '../components/connect/ConnectRegister.vue'
import ConnectEmailLogin from '../components/connect/ConnectEmailLogin.vue'

const {
  walletConnected,
  wallets,
  loadingAccount,
  wrongNetwork,
  connectError,
  getBalance,
  getSigner,
  connectWallet,
  reconnectWallet,
  disconnectWallet,
} = useChain()

const { redirectAfterLogin } = useLoginRedirect()

const registerMessage = (address: string) => {
  return `Register a CrowdTrust account with ${address}`
}

const loginMessage = (address: string) => {
  return `Log in to CrowdTrust with ${address}`
}

const state = ref<ConnectState>('welcome')
const registering = ref(false)
const loggingIn = ref(false)

const setState = (newState: ConnectState) => {
  state.value = newState
  authErrorKey.value = undefined
}

const signLogin = async (wallet: string) => {
  try {
    const signature = await signAuthMessage(loginMessage(wallet))
    if (!signature) {
      authErrorKey.value = 'errors.signature_failed'
      return
    }
    await loginUser({
      eth_address: wallet,
      eth_address_signature: signature,
    })
    if (!authErrorKey.value) {
      await redirectAfterLogin()
    }
  } catch (e) {
    console.log('Failed to sign login', e)
    authErrorKey.value = 'errors.signature_failed'
  }
}

const connect = async () => {
  await connectWallet('metamask')
  const wallet = wallets.value[0]
  if (walletConnected.value && wallet) {
    const exists = await userExists(wallet)
    if (!authErrorKey.value) {
      if (exists) {
        signLogin(wallet)
      } else {
        setState('register')
      }
    }
  }
}

const signAuthMessage = async (message: string): Promise<string | undefined> => {
  const signer = getSigner()
  return signer?.signMessage(message)
}

const register = async (data: IRegisterEmailPassword) => {
  const wallet = wallets.value[0]
  if (wallet) {
    registering.value = true
    try {
      const signature = await signAuthMessage(registerMessage(wallet))
      if (!signature) {
        authErrorKey.value = 'errors.signature_failed'
        return
      }
      await registerUser({
        ...data,
        eth_address: wallet,
        eth_address_signature: signature,
      })
      if (!authErrorKey.value) {
        await redirectAfterLogin()
      }
    } catch (e) {
      console.log('Signature failed:', e)
      authErrorKey.value = 'errors.signature_failed'
    }
    registering.value = false
  } else {
    authErrorKey.value = 'errors.missing_wallet'
  }
}

const login = async (payload: ILoginUserApiRequest) => {
  loggingIn.value = true
  try {
    await loginUser(payload)
    if (!authErrorKey.value) {
      await redirectAfterLogin()
    }
  } catch (e) {
    console.log('Failed to sign login', e)
    authErrorKey.value = 'errors.signature_failed'
  }
  loggingIn.value = false
}

onMounted(() => {
  reconnectWallet('metamask')
})
</script>

<style lang="postcss" scoped>
@import '../css/defines.postcss';

.connect-wrap {
  padding: 64px 0 120px;
  position: relative;
  min-height: calc(100vh - 360px);
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
