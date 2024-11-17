import {
  AssetContentType,
  AssetState,
  IListAssetsRequest,
  IListAssetsResponse,
  SortDirection,
} from '@app/types'
import {
  adminAuthHeader,
  AppDbResetService,
  expiredAdminToken,
  expiredUser1Token,
  testagent,
  TestAgent,
  userAuthHeader,
} from '../helpers'
import { beforeAll, beforeEach, describe, it, expect } from 'vitest'
import { testConfig } from '../test.config'

describe('List Project Assets', () => {
  const testEndpoint = '/api/project-assets'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let userAuth: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    adminAuth = adminAuthHeader()
    userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
  })

  describe('when requester is Admin', () => {
    it('returns 200 status and assets when filtered by content_type', async () => {
      const query: IListAssetsRequest = {
        content_type: AssetContentType.Jpeg,
      }

      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(2)
      expect(assets[0].id).toEqual('7d9cb4c7-06c3-4de4-a77c-4311386387c6')
      expect(assets[0].content_type).toEqual(AssetContentType.Jpeg)
      expect(assets[0].state).toEqual(AssetState.Created)
      expect(assets[0].user_id).toEqual('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
      expect(assets[0].project_id).toEqual('14bfe82a-1003-446b-b6bb-20a176e848e0')

      expect(assets[1].id).toEqual('b59ba8f3-3b53-426a-b3db-52b2f8557798')
      expect(assets[1].content_type).toEqual(AssetContentType.Jpeg)
      expect(assets[1].state).toEqual(AssetState.Created)
      expect(assets[1].user_id).toEqual('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
      expect(assets[1].project_id).toEqual('14bfe82a-1003-446b-b6bb-20a176e848e0')
    })

    it('returns 200 status and assets when filtered by user_id', async () => {
      const query: IListAssetsRequest = {
        user_id: '45013993-2a1a-4ee5-8dbd-b4b63d9af34f',
      }

      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(2)
      expect(assets[0].id).toEqual('7d9cb4c7-06c3-4de4-a77c-4311386387c6')
      expect(assets[1].id).toEqual('b59ba8f3-3b53-426a-b3db-52b2f8557798')
    })

    it('returns 200 status and all assets when no query params are provided ', async () => {
      const response = await api
        .get(testEndpoint)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(3)
    })

    it('returns 200 status and empty response when querying for non-existent assets', async () => {
      const query: IListAssetsRequest = {
        content_type: AssetContentType.Gif,
      }
      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListAssetsResponse = response.body
      expect(body.total_usage).toEqual(0)
      const assets = body.results

      expect(assets.length).toEqual(0)
    })

    it('returns 200 status and assets when sorted by created_at ASC', async () => {
      const query: IListAssetsRequest = {
        column: 'created_at',
        direction: SortDirection.Asc,
      }
      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(3)
      expect(assets[0].id).toEqual('873aa935-87e1-4e4c-8a7c-a7d8f083ed08')
      expect(assets[1].id).toEqual('b59ba8f3-3b53-426a-b3db-52b2f8557798')
      expect(assets[2].id).toEqual('7d9cb4c7-06c3-4de4-a77c-4311386387c6')
    })

    it('returns 400 status when user_id is not valid', async () => {
      const query: IListAssetsRequest = {
        user_id: '12345',
      }
      return api
        .get(testEndpoint)
        .set('Authorization', adminAuth)
        .query(query)
        .expect(400, {
          code: 'InvalidFormData',
          message: 'Failed to validate request',
          status: 400,
        })
    })

    it('returns 401 when admin token has expired', async () => {
      await api.get(testEndpoint).set('Authorization', expiredAdminToken).expect(401, {
        code: 'InvalidAuth',
        message: 'Unauthorized',
        status: 401,
      })
    })
  })

  describe('when requester is Owner', () => {
    it('returns 200 status and assets when filtering by user_id', async () => {
      const query: IListAssetsRequest = {
        user_id: '45013993-2a1a-4ee5-8dbd-b4b63d9af34f',
      }

      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', userAuth)
        .expect(200)

      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(2)
      expect(assets[0].id).toEqual('7d9cb4c7-06c3-4de4-a77c-4311386387c6')
      expect(assets[1].id).toEqual('b59ba8f3-3b53-426a-b3db-52b2f8557798')
    })

    it('returns 200 status with no filters', async () => {
      const response = await api
        .get(testEndpoint)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(2)
      expect(assets[0].id).toEqual('7d9cb4c7-06c3-4de4-a77c-4311386387c6')
      expect(assets[1].id).toEqual('b59ba8f3-3b53-426a-b3db-52b2f8557798')
    })

    it('returns 200 status when filtering by content_type Png and state', async () => {
      const query: IListAssetsRequest = {
        content_type: AssetContentType.Jpeg,
        state: AssetState.Created,
      }
      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(2)
      expect(assets[0].id).toEqual('7d9cb4c7-06c3-4de4-a77c-4311386387c6')
      expect(assets[1].id).toEqual('b59ba8f3-3b53-426a-b3db-52b2f8557798')
    })

    it('returns 200 status when filtering by content_type Svg', async () => {
      const query: IListAssetsRequest = {
        content_type: AssetContentType.Svg,
      }
      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IListAssetsResponse = response.body
      expect(body.total_usage).toEqual(0)
      const assets = body.results

      expect(assets.length).toEqual(0)
    })

    it('returns 200 status when filtering by project_id', async () => {
      const query: IListAssetsRequest = {
        project_id: '14bfe82a-1003-446b-b6bb-20a176e848e0',
      }

      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(2)
      expect(assets[0].id).toEqual('7d9cb4c7-06c3-4de4-a77c-4311386387c6')
      expect(assets[1].id).toEqual('b59ba8f3-3b53-426a-b3db-52b2f8557798')
    })

    it('returns 200 status when ordering by size', async () => {
      const query: IListAssetsRequest = {
        direction: SortDirection.Desc,
        column: 'size',
      }

      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IListAssetsResponse = response.body
      const assets = body.results

      expect(assets.length).toEqual(2)
      expect(assets[0].id).toEqual('b59ba8f3-3b53-426a-b3db-52b2f8557798')
      expect(assets[1].id).toEqual('7d9cb4c7-06c3-4de4-a77c-4311386387c6')
    })

    it('returns 401 when user token has expired', async () => {
      await api.get(testEndpoint).set('Authorization', expiredUser1Token).expect(401, {
        code: 'InvalidAuth',
        message: 'Unauthorized',
        status: 401,
      })
    })

    it('returns 403 status when filtering by other user_id', async () => {
      const query: IListAssetsRequest = {
        // Owner's ID different from the requester's ID
        user_id: 'b8d4843e-4b83-4340-9104-5b225ae551d5',
      }
      await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', userAuth)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })
  })

  it('When user is not authorized', async () => {
    await api.get(testEndpoint).expect(401, {
      code: 'Unauthorized',
      message: 'Unauthorized',
      status: 401,
    })
  })
})
