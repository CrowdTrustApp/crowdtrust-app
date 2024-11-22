import { AssetContentType } from '../asset'

export interface IRewardAssetViewModel {
  id: string
  project_id: string
  size: number
  content_type: AssetContentType
}

export interface IRewardViewModel {
  id: string
  name: string
  description: string
  delivery_time: number
  price: string
  backer_limit: number
  backer_count: number
  image?: IRewardAssetViewModel
  created_at: Date
  updated_at: Date
}
