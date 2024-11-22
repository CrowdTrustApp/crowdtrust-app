import { extFromContentType, IProjectAssetViewModelRelation } from '@app/types'
import { S3_PROJECT_ASSETS_URL } from '../config-env'

export const urlFromAsset = (asset: IProjectAssetViewModelRelation): string => {
  let ext = extFromContentType(asset.content_type)
  ext = ext ? `.${ext}` : ''

  return `${S3_PROJECT_ASSETS_URL}/${asset.project_id}/${asset.id}${ext}`
}
