import { IProjectViewModel } from '@app/types'
import { apiDeleteReward, apiGetProject, apiUpdateProject } from '@app/api'
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
    deleteReward,
    updateRewardsOrder,
  }
}
