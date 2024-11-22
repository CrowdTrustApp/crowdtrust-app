import {
  apiCreateRewardAsset,
  apiDeleteRewardAsset,
  apiVerifyRewardAsset,
  IUploadRewardFileResult,
  uploadFileWithSignedUrl,
} from '@app/api'
import { ICreateRewardAssetRequest, IVerifyAssetResponse } from '@app/types'
import { urlFromAsset } from '@app/util'

export const useRewardAsset = () => {
  const createAsset = async (
    data: ICreateRewardAssetRequest,
    file: File,
  ): Promise<IUploadRewardFileResult> => {
    const response = await apiCreateRewardAsset(data)
    const url = response.signed_url
    await uploadFileWithSignedUrl(url, file)
    return { ...response, url: urlFromAsset(response) }
  }

  const verifyAsset = async (id: string): Promise<IVerifyAssetResponse> => {
    const result = await apiVerifyRewardAsset(id)
    return result
  }

  const deleteAsset = async (id: string): Promise<void> => {
    await apiDeleteRewardAsset(id)
  }

  return {
    createAsset,
    verifyAsset,
    deleteAsset,
  }
}
