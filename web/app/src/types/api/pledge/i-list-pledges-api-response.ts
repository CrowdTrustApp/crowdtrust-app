import { IPledgeViewModel } from './i-pledge.view-model'

export interface IListPledgesApiResponse {
  total: number
  results: IPledgeViewModel[]
}
