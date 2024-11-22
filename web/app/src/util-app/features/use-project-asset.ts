import {
  apiCreateProjectAsset,
  apiDeleteProjectAsset,
  apiVerifyProjectAsset,
  IUploadFileResult,
  uploadFileWithSignedUrl,
} from '@app/api'
import { ICreateAssetRequest, IVerifyAssetResponse } from '@app/types'
import { urlFromAsset } from '@app/util'

export const useProjectAsset = () => {
  const createAsset = async (
    data: ICreateAssetRequest,
    file: File,
  ): Promise<IUploadFileResult> => {
    const response = await apiCreateProjectAsset(data)
    const url = response.signed_url
    await uploadFileWithSignedUrl(url, file)
    return { ...response, url: urlFromAsset(response) }
  }

  const verifyAsset = async (id: string): Promise<IVerifyAssetResponse> => {
    const result = await apiVerifyProjectAsset(id)
    return result
  }

  const deleteAsset = async (id: string): Promise<void> => {
    await apiDeleteProjectAsset(id)
  }

  return {
    createAsset,
    verifyAsset,
    deleteAsset,
  }
}
