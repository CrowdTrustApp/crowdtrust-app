import { rootApi } from './root-api'
import {
  ICreateRewardAssetRequest,
  ICreateAssetResponse,
  IVerifyAssetResponse,
} from '@app/types'

export interface IUploadRewardFileResult {
  id: string
  url: string
}

export const apiCreateRewardAsset = async (
  payload: ICreateRewardAssetRequest,
): Promise<ICreateAssetResponse> => {
  const { data } = await rootApi.authRequest({
    url: 'reward-assets',
    method: 'POST',
    data: payload,
  })
  return data as ICreateAssetResponse
}

export const apiVerifyRewardAsset = async (id: string): Promise<IVerifyAssetResponse> => {
  const { data } = await rootApi.authRequest<IVerifyAssetResponse>({
    url: `reward-assets/${id}/actions/verify`,
    method: 'POST',
  })
  return data
}

export const apiDeleteRewardAsset = async (id: string): Promise<void> => {
  await rootApi.authRequest({
    url: `reward-assets/${id}`,
    method: 'DELETE',
  })
}
