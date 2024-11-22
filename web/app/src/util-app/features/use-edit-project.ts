import { IProjectViewModel } from '@app/types'
import {
  apiDeleteReward,
  apiGetProject,
  apiUpdateProject,
  IUploadFileResult,
} from '@app/api'
import { ref } from 'vue'

const project = ref<IProjectViewModel | undefined>()

export const swappedOrder = (order: string[], from: number, to: number): string[] => {
  const newOrder = [...order]
  const oldId = newOrder[from]
  newOrder[from] = order[to]
  newOrder[to] = oldId
  return newOrder
}

export const useEditProject = () => {
  const loading = ref(false)

  const loadProject = async (id: string) => {
    loading.value = true
    try {
      project.value = await apiGetProject(id)
    } catch (e) {
      console.log('Load project error:', e)
    }
    loading.value = false
  }

  // Update assets_order and local project ref after asset upload
  const recordAddAsset = async (asset: IUploadFileResult) => {
    if (!project.value) {
      return
    }
    const assetsOrder = [...project.value.assets_order, asset.id]
    await updateAssetsOrder(assetsOrder)
    project.value.assets = [
      ...project.value.assets,
      {
        id: asset.id,
        content_type: asset.content_type,
        size: asset.size,
        project_id: asset.project_id,
      },
    ]
  }

  const updateAssetsOrder = async (order: string[]) => {
    if (!project.value) {
      return
    }
    const originalOrder = project.value.assets_order
    try {
      project.value.assets_order = order
      await apiUpdateProject(project.value.id, {
        assets_order: order,
      })
    } catch (e) {
      project.value.assets_order = originalOrder
      throw e
    }
  }

  const recordDeleteAsset = async (id: string) => {
    if (!project.value) {
      return
    }
    try {
      const newOrder = project.value.assets_order.filter((assetId) => assetId !== id)
      await apiUpdateProject(project.value.id, { assets_order: newOrder })
      project.value.assets_order = newOrder
      project.value.assets = project.value.assets.filter((asset) => asset.id !== id)
    } catch (e) {
      console.log('Failed to delete asset:', e)
    }
  }

  const updateRewardsOrder = async (order: string[]) => {
    if (!project.value) {
      return
    }
    const originalOrder = project.value.rewards_order
    try {
      project.value.rewards_order = order
      await apiUpdateProject(project.value.id, {
        rewards_order: order,
      })
    } catch (e) {
      project.value.rewards_order = originalOrder
      throw e
    }
  }

  const deleteReward = async (id: string) => {
    if (!project.value) {
      return
    }
    loading.value = true
    try {
      const newOrder = project.value.rewards_order.filter((orderId) => orderId !== id)
      await apiDeleteReward(id)
      await apiUpdateProject(project.value.id, { rewards_order: newOrder })
      project.value.rewards = project.value.rewards.filter((reward) => reward.id !== id)
      project.value.rewards_order = newOrder
    } catch (e) {
      console.log('Failed to delete reward:', e)
    }
    loading.value = false
  }

  return {
    project,
    loading,
    loadProject,
    updateAssetsOrder,
    recordAddAsset,
    recordDeleteAsset,
    deleteReward,
    updateRewardsOrder,
  }
}
