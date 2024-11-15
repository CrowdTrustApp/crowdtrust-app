import {
  ICreateProjectApiRequest,
  ICreateProjectApiResponse,
  IGetProjectApiResponse,
  IListProjectsApiRequest,
  IListProjectsApiResponse,
} from '@app/types'
import { rootApi } from './root-api'
import { RequestParams } from '@samatech/fetch-api'

export const apiListProjects = async (
  query: IListProjectsApiRequest,
): Promise<IListProjectsApiResponse> => {
  const { data } = await rootApi.authRequest<IListProjectsApiResponse>({
    url: 'projects',
    method: 'GET',
    params: query as unknown as RequestParams,
  })
  return data
}

export const apiGetProject = async (id: string): Promise<IGetProjectApiResponse> => {
  const { data } = await rootApi.authRequest<IGetProjectApiResponse>({
    url: `projects/${id}`,
    method: 'GET',
  })
  return data
}

export const apiCreateProject = async (
  payload: ICreateProjectApiRequest,
): Promise<ICreateProjectApiResponse> => {
  const { data } = await rootApi.authRequest<ICreateProjectApiResponse>({
    url: 'projects',
    method: 'POST',
    data: payload,
  })
  return data
}
