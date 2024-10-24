import { IRewardViewModel } from '../reward'
import { IProjectViewModel } from './i-project.view-model'

export interface IGetProjectApiResponse extends IProjectViewModel {
  rewards: IRewardViewModel[]
}
