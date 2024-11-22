import { Wallet } from 'ethers'

export const USER3_ADDRESS = '0x0bfcaae5abf40a828e6b37379f99dcbeda712345'
export const USER3_PRIVATE_KEY =
  'b19f2325a73af5ee8592b7aaa53f337d1f404836c577879675b75c86a58896ab'

// A real address/private key for testing
export const TEST_ADDRESS1 = '0xea6031Faf6AC44D3F69001E5B0213c110De00001'
export const TEST_PRIVATE_KEY1 =
  '5ce848d1ed6d25c7fd081413b130ccbe954b18ada0f89551393ecfa81de78ab9'

export const TEST_ADDRESS2 = '0xD3Dd7848c13125061b9e12d3A10d33156AB00000'
export const TEST_PRIVATE_KEY2 =
  'f30beaba82358efb4e109cef9b31bb5ac2ebdd5f53f70d6e8ed469dcdb2338f8'

export const signMessage = (key: string, message: string): Promise<string> => {
  const signer = new Wallet(key)
  return signer.signMessage(message)
}

export const registerSignature = (key: string, address: string) => {
  const message = `Register a CrowdTrust account with ${address}`
  return signMessage(key, message)
}
