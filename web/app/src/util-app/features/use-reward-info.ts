import {
  apiCreateReward,
  apiCreateRewardAsset,
  apiDeleteRewardAsset,
  apiUpdateProject,
  apiUpdateReward,
  apiVerifyRewardAsset,
  uploadFileWithSignedUrl,
} from '@app/api'
import {
  ICreateRewardApiRequest,
  ICreateRewardAssetRequest,
  IProjectViewModel,
  IRewardViewModel,
  IUpdateRewardApiRequest,
  IUpdateRewardFeature,
} from '@app/types'
import { ref } from 'vue'
import { addDays } from 'date-fns'
import { useInputLimit } from '../use-input-limit'
import { ts } from '../../i18n'
import { ValidatedFile } from '../../util/validate'

export const useRewardInfoFields = (reward?: IRewardViewModel) => {
  const name = useInputLimit({ min: 3, max: 30, label: 'Name', initial: reward?.name })
  const description = useInputLimit({
    min: 8,
    max: 100,
    label: 'Description',
    initial: reward?.description,
  })
  const delivery = reward ? new Date(reward.delivery_time * 1000) : undefined
  const deliveryTime = ref<Date | undefined>(delivery ?? addDays(new Date(), 10))
  const backerLimit = ref(reward?.backer_limit?.toString() ?? '')
  const initialPrice = reward ? parseFloat(reward.price) / 1e18 : undefined
  const price = ref(initialPrice?.toString() ?? '0.1')

  return {
    name,
    description,
    deliveryTime,
    backerLimit,
    price,
  }
}

export const useRewardInfo = (): IUpdateRewardFeature => {
  const error = ref()
  const submitting = ref(false)
  let fields = useRewardInfoFields()

  const submitUpdate = async (id: string, payload: IUpdateRewardApiRequest) => {
    try {
      await apiUpdateReward(id, payload)
    } catch (e) {
      console.log('Update error:', e)
      error.value = ts('errors.Unknown')
    }
  }

  const submitCreate = async (
    project: IProjectViewModel,
    payload: ICreateRewardApiRequest,
  ): Promise<string | undefined> => {
    try {
      const res = await apiCreateReward(project.id, payload)
      await apiUpdateProject(project.id, {
        rewards_order: [...project.rewards_order, res.id],
      })
      return res.id
    } catch (e) {
      console.log('Create error:', e)
      error.value = ts('errors.Unknown')
    }
  }

  const uploadRewardImage = async (file: ValidatedFile, rewardId: string) => {
    const payload: ICreateRewardAssetRequest = {
      content_size: file.file.size,
      content_type: file.type,
      reward_id: rewardId,
    }

    try {
      const response = await apiCreateRewardAsset(payload)
      const url = response.signed_url
      await uploadFileWithSignedUrl(url, file.file)
      const success = await apiVerifyRewardAsset(response.id)
      if (!success) {
        error.value = ts('errors.asset_verify')
        return
      }
    } catch (e) {
      console.log('Reward asset error:', e)
      error.value = ts('errors.Unknown')
    }
  }

  const replaceRewardImage = async (file: ValidatedFile, reward: IRewardViewModel) => {
    try {
      if (reward.image) {
        await apiDeleteRewardAsset(reward.image.id)
      }
      await uploadRewardImage(file, reward.id)
    } catch (e) {
      console.log('Reward asset error:', e)
      error.value = ts('errors.Unknown')
    }
  }

  return {
    error,
    submitting,
    ...fields,
    submitUpdate,
    submitCreate,
    uploadRewardImage,
    replaceRewardImage,
  }
}
