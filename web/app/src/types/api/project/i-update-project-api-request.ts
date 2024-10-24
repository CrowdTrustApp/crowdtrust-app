import { ProjectCategory } from './enum-project-category'
import { ProjectStatus } from './enum-project-status'

export interface IUpdateProjectApiRequest {
  name?: string
  description?: string
  blurb?: string
  payment_address?: string
  status?: ProjectStatus
  category?: ProjectCategory
  funding_goal?: string
  start_time?: number
  duration?: number
}
