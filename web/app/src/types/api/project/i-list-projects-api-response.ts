import { IProjectViewModel } from './i-project.view-model'

export interface IListProjectsApiResponse {
  total: number
  results: IProjectViewModel[]
}
