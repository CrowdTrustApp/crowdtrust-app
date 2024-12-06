import {
  AssetContentType,
  CONTENT_TYPE_EXTS,
  MEDIA_CONTENT_TYPES,
  extFromContentType,
} from '@app/types'

function extContentType(ext: string | undefined): AssetContentType | undefined {
  if (!ext) return undefined
  return Object.fromEntries(
    Object.entries(CONTENT_TYPE_EXTS).map(([key, value]) => [value, key]),
  )[ext] as AssetContentType | undefined
}

export interface MediaRequirements {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  types?: AssetContentType[]
  size?: number
}

export interface ValidatedFile {
  file: File
  type: AssetContentType
  src?: string
}

export interface IValidateMediaError {
  fileErrors: string[]
}

const parseExt = (fileName: string): string | undefined => {
  const ext = fileName.split('.').pop()
  if (ext === 'jpeg') {
    return 'jpg'
  }
  return ext
}

export async function validateMedia(
  requirements: MediaRequirements,
  file: File,
): Promise<ValidatedFile> {
  const errors: string[] = []
  const URL = window.URL || window.webkitURL
  let img: HTMLImageElement | null = null
  let video: HTMLVideoElement | null = null
  const validTypes = requirements.types ?? MEDIA_CONTENT_TYPES
  const type = file.type as AssetContentType

  const { size } = requirements
  const reqSize = size ?? 0
  if (reqSize && file.size > reqSize) {
    errors.push('FILE_SIZE_BIG')
  }
  const fileExt = parseExt(file.name)
  const ext = validTypes.map(extFromContentType)
  if (!fileExt || !(ext.includes(fileExt) || !validTypes.includes(type))) {
    errors.push('FILE_TYPE')
  }
  if (errors.length) {
    throw { fileErrors: errors }
  }

  const result: ValidatedFile = { file, type }
  result.src = URL.createObjectURL(file)

  try {
    const fileType = file.type || fileExt || ''
    if (fileType.includes('image')) {
      img = new Image()
      img.src = result.src
      return new Promise((resolve, reject) => {
        if (img) {
          img.onload = function () {
            const { minWidth, minHeight, maxWidth, maxHeight } = requirements
            const { width: imgWidth = 0, height: imgHeight = 0 } = img ?? {}
            if (minWidth && imgWidth < minWidth) {
              errors.push('IMAGE_MIN_WIDTH')
            }
            if (minHeight && imgHeight < minHeight) {
              errors.push('IMAGE_MIN_HEIGHT')
            }
            if (maxWidth && imgWidth > maxWidth) {
              errors.push('IMAGE_MAX_WIDTH')
            }
            if (maxHeight && imgHeight > maxHeight) {
              errors.push('IMAGE_MAX_HEIGHT')
            }

            if (errors.length) {
              reject({ fileErrors: errors })
            } else {
              resolve(result)
            }
          }
        } else {
          reject({ fileErrors: ['errors.default'] })
        }
      })
    } else if (fileType.includes('vide')) {
      video = document.createElement('video')
      video.src = result.src
      return new Promise((resolve, reject) => {
        if (video) {
          video.addEventListener('loadeddata', (_e) => {
            resolve(result)
          })
        } else {
          reject({ fileErrors: ['errors.default'] })
        }
      })
    } else if (
      fileType.includes('pdf') ||
      fileType.includes('wasm') ||
      fileType.includes('javascript') ||
      fileType.includes('ttf') ||
      fileType.includes('otf') ||
      fileType.includes('woff2')
    ) {
      result.type = result.type || extContentType(fileExt)
      return result
    }
  } catch (_e) {
    errors.push('FILE_TYPE')
  }
  throw { fileErrors: errors || ['errors.default'] }
}
