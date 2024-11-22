import {
  IGetUserApiResponse,
  ILoginUserApiRequest,
  ILoginUserApiResponse,
  IRegisterUserApiRequest,
  IRegisterUserApiResponse,
  IUpdateUserApiRequest,
  IUpdateUserApiResponse,
  IUserExistsApiRequest,
  IUserExistsApiResponse,
} from '@app/types'
import { rootApi } from './root-api'
import { RequestParams } from '@samatech/fetch-api'

export const apiUserExists = async (
  query: IUserExistsApiRequest,
): Promise<IUserExistsApiResponse> => {
  const { data } = await rootApi.authRequest({
    url: 'users/queries/exists',
    method: 'GET',
    params: query as unknown as RequestParams,
  })
  return data as IUserExistsApiResponse
}

export const apiRegisterUser = async (
  payload: IRegisterUserApiRequest,
): Promise<IRegisterUserApiResponse> => {
  const { data } = await rootApi.authRequest({
    url: 'users/registrations',
    method: 'POST',
    data: payload,
  })
  return data as IRegisterUserApiResponse
}

export const apiLoginUser = async (
  payload: ILoginUserApiRequest,
): Promise<ILoginUserApiResponse> => {
  const { data } = await rootApi.authRequest({
    url: 'auth/logins',
    method: 'POST',
    data: payload,
  })
  return data as ILoginUserApiResponse
}

export const apiGetUser = async (id: string): Promise<IGetUserApiResponse> => {
  const { data } = await rootApi.authOptRequest({
    url: `users/${id}`,
    method: 'GET',
  })
  return data as IGetUserApiResponse
}

export const apiUpdateUser = async (id: string, payload: IUpdateUserApiRequest) => {
  const { data } = await rootApi.authRequest({
    url: `users/${id}`,
    method: 'PATCH',
    data: payload,
  })
  return data as IUpdateUserApiResponse
}
