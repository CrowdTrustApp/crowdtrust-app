import {
  IGetPledgeApiResponse,
  IListPledgesApiRequest,
  IListPledgesApiResponse,
} from '@app/types'
import { rootApi } from './root-api'
import { RequestParams } from '@samatech/fetch-api'

export const apiGetPledge = async (id: string): Promise<IGetPledgeApiResponse> => {
  const { data } = await rootApi.authRequest<IGetPledgeApiResponse>({
    url: `pledges/${id}`,
    method: 'GET',
  })
  return data
}

export const apiListPledges = async (
  query: IListPledgesApiRequest,
): Promise<IListPledgesApiResponse> => {
  const { data } = await rootApi.authRequest<IListPledgesApiResponse>({
    url: 'pledges',
    method: 'GET',
    params: query as unknown as RequestParams,
  })
  return data
}
