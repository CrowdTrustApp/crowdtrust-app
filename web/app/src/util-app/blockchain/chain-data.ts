import { computed } from 'vue'
import { useEth } from './use-eth'

interface IChainData {
  contract: string
  name: string
  explorer: string
}

const { chainId } = useEth()

const localhost: IChainData = {
  contract: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  name: 'localhost',
  explorer: '',
}

const sepolia: IChainData = {
  contract: '',
  name: 'Sepolia',
  explorer: 'https://sepolia.etherscan.io',
}

const mainnet: IChainData = {
  contract: '',
  name: 'Mainnet',
  explorer: 'https://etherscan.io',
}

export const chainData = computed(() => {
  let id = chainId.value || window.ethereum.chainId
  id = id ? parseInt(id) : id
  if (id === 1337) {
    return localhost
  } else if (id === 11155111) {
    return sepolia
  } else if (id === 1) {
    return mainnet
  }
})

export const transactionLink = (hash: string) => {
  const chain = chainData.value ?? mainnet
  return `${chain.explorer}/tx/${hash}`
}

export const contractLink = () => {
  const chain = chainData.value ?? mainnet
  return `${chain.explorer}/address/${chain.contract}`
}
