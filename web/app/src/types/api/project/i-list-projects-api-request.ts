import { SortDirection } from '../shared'
import { ProjectCategory } from './enum-project-category'
import { ProjectStatus } from './enum-project-status'

export interface IListProjectsApiRequest {
  readonly from?: number
  readonly to?: number
  categories?: ProjectCategory[]
  statuses?: ProjectStatus[]
  user_id?: string
  column?: 'total_pledged' | 'funding_goal' | 'created_at' | 'updated_at'
  direction?: SortDirection
}
