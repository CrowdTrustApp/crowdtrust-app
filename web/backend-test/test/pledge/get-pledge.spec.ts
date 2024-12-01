import { IGetPledgeApiResponse } from '@app/types'
import { testagent, TestAgent, AppDbResetService } from '../helpers'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'
import { adminAuthHeader, userAuthHeader } from '../helpers'
import { testConfig } from '../test.config'

describe('Get Pledge', () => {
  const testEndpoint = '/api/pledges'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let pledgeId: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
    adminAuth = adminAuthHeader()
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    pledgeId = '8e766cf6-c74a-4263-9974-4a0c201b728c'
  })

  describe('when requester is Admin', () => {
    test('returns 200 and pledge with relations', async () => {
      const response = await api
        .get(`${testEndpoint}/${pledgeId}`)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IGetPledgeApiResponse = response.body

      expect(body.id).toEqual('8e766cf6-c74a-4263-9974-4a0c201b728c')
      expect(body.pledge_items).toHaveLength(2)
      expect(body.pledge_items[0].id).toEqual('d028c7c7-2422-4864-b8be-5d24071f89f3')
      expect(body.pledge_items[1].id).toEqual('bccc7f22-d8c9-4bef-adbc-e0804def90e6')
    })
  })

  describe('when requester is User', () => {
    let userAuth: string

    beforeEach(() => {
      userAuth = userAuthHeader('276168ed-9228-4d6b-aec2-ed53bb7c1901')
    })

    test('returns 200 and pledge when getting own pledge', async () => {
      const response = await api
        .get(`${testEndpoint}/${pledgeId}`)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IGetPledgeApiResponse = response.body

      expect(body.id).toEqual('8e766cf6-c74a-4263-9974-4a0c201b728c')
      expect(body.pledge_items).toHaveLength(2)
      expect(body.pledge_items[0].id).toEqual('d028c7c7-2422-4864-b8be-5d24071f89f3')
      expect(body.pledge_items[1].id).toEqual('bccc7f22-d8c9-4bef-adbc-e0804def90e6')
    })

    test('returns 403 and pledge when getting other user pledge', async () => {
      const otherPledgeId = 'ac69089a-fbe6-4879-bbb2-ced6446092c0'
      await api
        .get(`${testEndpoint}/${otherPledgeId}`)
        .set('Authorization', userAuth)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })
  })

  test('returns 404 when pledge does not exist', async () => {
    const noneExistId = '870aafc9-36e9-476a-b38c-c1aaaad9d9fe'
    await api
      .get(`${testEndpoint}/${noneExistId}`)
      .set('Authorization', adminAuth)
      .expect(404, {
        code: 'None',
        message: 'Not found',
        status: 404,
      })
  })
})
