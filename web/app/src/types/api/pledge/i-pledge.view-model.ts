import { BlockchainStatus, PaymentCurrency } from '../project'

export interface IPledgeViewModel {
  id: string
  project_id: string
  user_id: string
  comment: string
  created_at: Date
  updated_at: Date
}

export interface IPledgeItemViewModel {
  id: string
  pledge_id: string
  reward_id: string
  quantity: number
  paid_price: string
  paid_currency: PaymentCurrency
  blockchain_status: BlockchainStatus
  transaction_hash?: string
  created_at: Date
  updated_at: Date
}
