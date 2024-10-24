export interface IRegisterEmailPassword {
  email: string
  password: string
}

export interface IRegisterUserApiRequest extends IRegisterEmailPassword {
  eth_address: string
  eth_address_signature: string
}
