import { AssetContentType } from './asset-content-type'

export interface IReplaceAssetRequest {
  name: string
  content_size: number
  content_type: AssetContentType
}
