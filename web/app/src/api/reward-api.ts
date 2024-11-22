import {
  ICreateRewardApiRequest,
  ICreateRewardApiResponse,
  IUpdateRewardApiRequest,
} from '@app/types'
import { rootApi } from './root-api'

export const apiCreateReward = async (
  projectId: string,
  payload: ICreateRewardApiRequest,
): Promise<ICreateRewardApiResponse> => {
  const { data } = await rootApi.authRequest<ICreateRewardApiResponse>({
    url: `projects/${projectId}/rewards`,
    method: 'POST',
    data: payload,
  })
  return data
}

export const apiUpdateReward = async (
  id: string,
  payload: IUpdateRewardApiRequest,
): Promise<ICreateRewardApiResponse> => {
  const { data } = await rootApi.authRequest<ICreateRewardApiResponse>({
    url: `rewards/${id}`,
    method: 'PATCH',
    data: payload,
  })
  return data
}

export const apiDeleteReward = async (id: string): Promise<void> => {
  await rootApi.authRequest({
    url: `rewards/${id}`,
    method: 'DELETE',
  })
}
