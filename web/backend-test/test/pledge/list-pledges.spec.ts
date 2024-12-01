import { IListPledgesApiRequest, IListPledgesApiResponse } from '@app/types'
import { testagent, TestAgent, adminAuthHeader, userAuthHeader } from '../helpers'
import { testConfig } from '../test.config'
import { AppDbResetService } from '../helpers'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'

const TotalPledges = 3

describe('List Pledges', () => {
  const testEndpoint = '/api/pledges'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let query: IListPledgesApiRequest
  let adminAuth: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    adminAuth = adminAuthHeader()
  })

  describe('when requester is Admin', () => {
    test('return 200 status code and pledges with default sorting', async () => {
      const response = await api
        .get(testEndpoint)
        .set('Authorization', adminAuth)
        .expect(200)
      const body: IListPledgesApiResponse = response.body

      expect(body.total).toEqual(TotalPledges)
      expect(body.results.length).toEqual(TotalPledges)
    })

    test('returns 200 status and pledges when filtering from 1 to 2', async () => {
      query = { from: 1, to: 2 }

      const response = await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListPledgesApiResponse = response.body
      const pledges = body.results

      expect(body.total).toEqual(TotalPledges)
      expect(pledges.length).toEqual(2)

      expect(pledges[0].id).toEqual('23c0599a-7990-4949-820c-3254079955f2')
      expect(pledges[1].id).toEqual('ac69089a-fbe6-4879-bbb2-ced6446092c0')
    })

    test('filters by user_id', async () => {
      const response = await api
        .get(testEndpoint)
        .query('user_id=276168ed-9228-4d6b-aec2-ed53bb7c1901')
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListPledgesApiResponse = response.body

      expect(body.total).toEqual(1)
      expect(body.results[0].id).toEqual('8e766cf6-c74a-4263-9974-4a0c201b728c')
    })

    test('filters by project_id', async () => {
      const response = await api
        .get(testEndpoint)
        .query('project_id=14bfe82a-1003-446b-b6bb-20a176e848e0')
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListPledgesApiResponse = response.body
      const pledges = body.results

      expect(body.total).toEqual(2)
      expect(pledges[0].id).toEqual('ac69089a-fbe6-4879-bbb2-ced6446092c0')
      expect(pledges[1].id).toEqual('8e766cf6-c74a-4263-9974-4a0c201b728c')
    })

    test('filters by project_id and user_id', async () => {
      const response = await api
        .get(testEndpoint)
        .query({
          project_id: '14bfe82a-1003-446b-b6bb-20a176e848e0',
          user_id: '276168ed-9228-4d6b-aec2-ed53bb7c1901',
        })
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IListPledgesApiResponse = response.body

      expect(body.total).toEqual(1)
      expect(body.results[0].id).toEqual('8e766cf6-c74a-4263-9974-4a0c201b728c')
    })
  })

  describe('when requester is User', () => {
    let userAuth: string

    beforeEach(() => {
      userAuth = userAuthHeader('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')
    })

    test('returns pledges when filtering by own id', async () => {
      const response = await api
        .get(testEndpoint)
        .query({ user_id: '00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd' })
        .set('Authorization', userAuth)
        .expect(200)
      const body: IListPledgesApiResponse = response.body

      expect(body.total).toEqual(2)
      expect(body.results.length).toEqual(2)
      expect(body.results[0].id).toEqual('23c0599a-7990-4949-820c-3254079955f2')
      expect(body.results[1].id).toEqual('ac69089a-fbe6-4879-bbb2-ced6446092c0')
    })

    test('returns error when not filtering by user_id', async () => {
      await api.get(testEndpoint).set('Authorization', userAuth).expect(403, {
        code: 'None',
        message: 'User must filter by own ID',
        status: 403,
      })
    })

    test('returns error when filtering by other user_id', async () => {
      query = { user_id: '45013993-2a1a-4ee5-8dbd-b4b63d9af34f' }
      await api
        .get(testEndpoint)
        .query(query)
        .set('Authorization', userAuth)
        .expect(403, {
          code: 'None',
          message: 'User must filter by own ID',
          status: 403,
        })
    })
  })

  describe('when requester is Anonymous', () => {
    test('returns 403 error', async () => {
      await api.get(testEndpoint).query(query).expect(401, {
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
      })
    })
  })
})
