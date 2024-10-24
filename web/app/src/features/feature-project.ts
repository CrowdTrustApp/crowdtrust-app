import { apiGetProject, apiListProjects } from '@app/api'
import { IListProjectsApiRequest, IProjectViewModel } from '@app/types'
import { errorToKey } from '@app/util'
import { IFeatureParams } from './i-feature-params'

export interface IListProjectParams extends IFeatureParams {
  projects: IProjectViewModel[]
}

export interface IGetProjectParams extends IFeatureParams {
  project: IProjectViewModel | undefined
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
