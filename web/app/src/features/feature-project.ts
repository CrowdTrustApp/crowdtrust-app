import { apiGetProject, apiListPledges, apiListProjects } from '@app/api'
import {
  IGetPledgeViewModel,
  IListProjectsApiRequest,
  IProjectViewModel,
} from '@app/types'
import { errorToKey } from '@app/util'
import { IFeatureParams } from './i-feature-params'
import { store } from '@app/store'

export interface IListProjectParams extends IFeatureParams {
  projects: IProjectViewModel[]
}

export interface IGetProjectParams extends IFeatureParams {
  project: IProjectViewModel | undefined
}

export interface IGetPledgeParams extends IFeatureParams {
  pledge: IGetPledgeViewModel | undefined
}

export const listProjects = async (
  payload: IListProjectsApiRequest,
  params: IListProjectParams,
) => {
  params.error = undefined
  params.loading = true
  try {
    const res = await apiListProjects(payload)
    params.projects = res.results
  } catch (e) {
    params.error = errorToKey(e)
  }
  params.loading = false
}

export const getProject = async (id: string, params: IGetProjectParams) => {
  params.error = undefined
  params.loading = true
  try {
    const res = await apiGetProject(id)
    params.project = res
  } catch (e) {
    params.error = errorToKey(e)
  }
  params.loading = false
}

export const getPledge = async (projectId: string, params: IGetPledgeParams) => {
  const user_id = store.auth.userId.value
  if (!user_id) {
    return undefined
  }
  params.loading = true
  try {
    const res = await apiListPledges({ user_id, project_id: projectId })
    const pledge = res.results[0]
    params.pledge = pledge
    // Populate local cart if empty
    if (pledge) {
      store.cart.populateCart(projectId, params.pledge.pledge_items)
    }
  } catch (e) {
    console.log('Failed to get pledge:', e)
  }
  params.loading = false
}

export const compareCartPledge = (
  projectId: string,
  pledge: IGetPledgeViewModel | undefined,
): boolean => {
  const cart = store.cart.projects.value[projectId]
  // Cart is not empty and pledge is
  if (cart?.items.length && !pledge?.pledge_items.length) {
    return false
  } else if (!cart?.items.length && pledge?.pledge_items.length) {
    // Use Pledge as source of truth, if local cart is not up to date
    return true
  }
  // Different number of items
  if (cart.items.length !== pledge?.pledge_items.length) {
    return false
  }
  const items: Record<string, number> = {}
  for (const item of cart.items) {
    items[item.rewardId] = item.quantity
  }
  for (const pledgeItem of pledge?.pledge_items ?? []) {
    const quantity = items[pledgeItem.reward_id]
    // Different quantity or non-matching reward ID
    if (quantity === undefined || pledgeItem.quantity !== quantity) {
      return false
    }
  }
  return true
}
