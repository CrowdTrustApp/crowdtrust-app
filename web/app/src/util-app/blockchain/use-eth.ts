import { useChain } from '@samatech/vue3-eth'
import { ref } from 'vue'

const {
  getProvider,
  getSigner,
  connectWallet,
  reconnectWallet,
  getBalance,
  wallets,
  walletConnected,
  chainId,
} = useChain()

const sleep = (waitTimeInMs: number) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs))

export const useEth = () => {
  const pollCancel = ref(false)

  const getProviderOrConnect = async () => {
    let provider = getProvider()
    if (!walletConnected.value || !provider) {
      await connectWallet('metamask')
      provider = getProvider()
    }
    return provider
  }

  const getSignerOrConnect = async () => {
    let signer = getSigner()
    if (!walletConnected.value || !signer) {
      await connectWallet('metamask')
      signer = getSigner()
    }
    return signer
  }

  const isMined = async (hash: string) => {
    const provider = await getProviderOrConnect()
    const receipt = await provider?.getTransactionReceipt(hash)
    if (receipt?.blockNumber) {
      return receipt
    }
  }

  const pollTransaction = async (hash: string) => {
    await sleep(1500)
    while (!pollCancel.value) {
      const receipt = await isMined(hash)
      if (receipt) {
        return receipt.status == 1
      }
      await sleep(3000)
    }
    pollCancel.value = false
  }

  const cancelPoll = () => {
    pollCancel.value = true
  }

  return {
    getSigner,
    getSignerOrConnect,
    getProvider,
    getProviderOrConnect,
    connectWallet,
    reconnectWallet,
    getBalance,
    isMined,
    pollTransaction,
    cancelPoll,
    wallets,
    chainId,
    walletConnected,
  }
}
