import { RequestParams } from '@sampullman/fetch-api'
import { rootApi } from './root-api'
import {
  ICreateAssetRequest,
  ICreateAssetResponse,
  IListAssetsRequest,
  IListAssetsResponse,
  IVerifyAssetResponse,
} from '@app/types'

export interface IUploadFileResult extends ICreateAssetResponse {
  url: string
}

export const apiCreateProjectAsset = async (
  payload: ICreateAssetRequest,
): Promise<ICreateAssetResponse> => {
  const { data } = await rootApi.authRequest({
    url: 'project-assets',
    method: 'POST',
    data: payload,
  })
  return data as ICreateAssetResponse
}

export const apiVerifyProjectAsset = async (
  id: string,
): Promise<IVerifyAssetResponse> => {
  const { data } = await rootApi.authRequest({
    url: `project-assets/${id}/actions/verify`,
    method: 'POST',
  })
  return data as IVerifyAssetResponse
}

export const apiListProjectAssets = async (
  params: IListAssetsRequest,
): Promise<IListAssetsResponse> => {
  const { data } = await rootApi.authRequest({
    url: 'project-assets',
    method: 'GET',
    params: params as RequestParams,
  })
  return data as IListAssetsResponse
}

export const apiDeleteProjectAsset = async (id: string): Promise<void> => {
  await rootApi.authRequest({
    url: `project-assets/${id}`,
    method: 'DELETE',
  })
}

export const uploadFileWithSignedUrl = (url: string, file: File): Promise<Response> => {
  return fetch(url, { method: 'PUT', body: file, mode: 'cors' })
}
