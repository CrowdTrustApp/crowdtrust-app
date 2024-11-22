import { Ref } from 'vue'
import {
  ICreateRewardApiRequest,
  IProjectViewModel,
  IRewardViewModel,
  IUpdateRewardApiRequest,
} from '../api'
import { IInputLimit } from './i-input-limit'
import { ValidatedFile } from '@app/util'

export interface IUpdateRewardFeature {
  error: Ref<string | undefined>
  name: IInputLimit
  description: IInputLimit
  deliveryTime: Ref<Date | undefined>
  backerLimit: Ref<string>
  price: Ref<string>
  submitting: Ref<boolean>
  submitUpdate: (id: string, payload: IUpdateRewardApiRequest) => Promise<void>
  submitCreate: (
    project: IProjectViewModel,
    payload: ICreateRewardApiRequest,
  ) => Promise<string | undefined>
  uploadRewardImage(file: ValidatedFile, rewardId: string): Promise<void>
  replaceRewardImage(file: ValidatedFile, reward: IRewardViewModel): Promise<void>
}
