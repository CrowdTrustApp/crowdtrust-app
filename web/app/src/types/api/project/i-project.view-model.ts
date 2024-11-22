import { AssetContentType } from '../asset'
import { IRewardViewModel } from '../reward'
import { BlockchainStatus } from './enum-blockchain-status'
import { PaymentCurrency } from './enum-payment-currency'
import { ProjectCategory } from './enum-project-category'
import { ProjectStatus } from './enum-project-status'

export interface IProjectAssetViewModelRelation {
  id: string
  content_type: AssetContentType
  size: number
  project_id: string
}

export interface IProjectViewModel {
  id: string
  user_id: string
  name: string
  description: string
  blurb: string
  contract_address: string
  payment_address: string
  category: ProjectCategory
  funding_goal: string
  start_time: number
  duration: number
  total_pledged: string
  backer_count: number
  base_currency: PaymentCurrency
  status: ProjectStatus
  blockchain_status: BlockchainStatus
  transaction_hash?: string
  rewards: IRewardViewModel[]
  rewards_order: string[]
  assets: IProjectAssetViewModelRelation[]
  assets_order: string[]
  created_at: Date
  updated_at: Date
}
