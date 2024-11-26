import { Ref } from 'vue'
import {
  ICreateProjectApiRequest,
  IUpdateProjectApiRequest,
  ProjectCategory,
} from '../api'
import { IInputLimit } from './i-input-limit'

export interface IUpdateProjectFeature {
  error: Ref<string | undefined>
  name: IInputLimit
  blurb: IInputLimit
  description: IInputLimit
  category: Ref<ProjectCategory | undefined>
  startTime: Ref<Date | undefined>
  duration: Ref<string>
  goal: Ref<string>
  submitting: Ref<boolean>
  isActive: () => boolean
  submitUpdate: (id: string, payload: IUpdateProjectApiRequest) => Promise<void>
  submitCreate: (payload: ICreateProjectApiRequest) => Promise<string | undefined>
  updateProjectFields: (request: IUpdateProjectApiRequest) => void
  addChangedField: (
    request: IUpdateProjectApiRequest,
    field: string,
    value: unknown,
  ) => boolean
}
