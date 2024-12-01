import { IGetPledgeViewModel } from './i-pledge.view-model'

export interface IListPledgesApiResponse {
  total: number
  results: IGetPledgeViewModel[]
}
