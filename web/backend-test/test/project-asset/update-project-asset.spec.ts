import { AssetState, IUpdateAssetRequest, IUpdateAssetResponse } from '@app/types'
import {
  adminAuthHeader,
  AppDbResetService,
  testagent,
  TestAgent,
  userAuthHeader,
} from '../helpers'
import { beforeAll, beforeEach, describe, it, expect } from 'vitest'
import { testConfig } from '../test.config'

describe('Update Project Asset', () => {
  const testEndpoint = '/api/project-assets'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let userAuth: string
  let userAssetId: string
  let payload: IUpdateAssetRequest

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    adminAuth = adminAuthHeader()
    userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')

    userAssetId = '7d9cb4c7-06c3-4de4-a77c-4311386387c6'
  })

  describe('when requester is Admin', () => {
    it('returns 200 status code and message when update state', async () => {
      payload = { state: AssetState.Expired }
      const response = await api
        .patch(`${testEndpoint}/${userAssetId}`)
        .set('Authorization', adminAuth)
        .send(payload)
        .expect(200)

      const body: IUpdateAssetResponse = response.body

      expect(body.state).toEqual(payload.state)
    })
  })

  describe('when requester is Owner', () => {
    it('returns 400 status when update state', async () => {
      payload = { state: AssetState.Expired }
      return api
        .patch(`${testEndpoint}/${userAssetId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'None',
          message: 'Unauthorized field update',
          status: 400,
        })
    })
  })

  describe('when request is invalid', () => {
    it('when user requester is not project owner', () => {
      const newAuth = userAuthHeader('276168ed-9228-4d6b-aec2-ed53bb7c1901')

      return api
        .patch(`${testEndpoint}/${userAssetId}`)
        .set('Authorization', newAuth)
        .send(payload)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })

    it('when project asset id does not exist', () => {
      const projectAssetId = '1c2e5d05-7fa3-416d-985b-4cb9ee3ca6c5'

      return api
        .patch(`${testEndpoint}/${projectAssetId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(404, {
          code: 'None',
          message: 'Project asset not found',
          status: 404,
        })
    })

    it('when user is not authorized', () => {
      return api.patch(`${testEndpoint}/${userAssetId}`).expect(401, {
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
      })
    })
  })
})
