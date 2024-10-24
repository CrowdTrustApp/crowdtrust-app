export interface IUpdateUserApiRequest {
  email?: string
  name?: string
  description?: string
  link?: string
  location?: string
  old_password?: string
  new_password?: string
  eth_address?: string
  eth_address_signature?: string
  user_type?: string
  user_status?: string
}
