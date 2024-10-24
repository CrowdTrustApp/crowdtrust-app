import { ProjectCategory } from './enum-project-category'

export interface ICreateProjectApiRequest {
  name: string
  description: string
  blurb: string
  category: ProjectCategory
  funding_goal: string
  start_time: number
  duration: number
}
