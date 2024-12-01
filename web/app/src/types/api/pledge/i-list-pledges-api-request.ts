import { SortDirection } from '../shared'

export interface IListPledgesApiRequest {
  readonly from?: number
  readonly to?: number
  project_id?: string
  user_id?: string
  column?: 'created_at' | 'updated_at'
  direction?: SortDirection
}
