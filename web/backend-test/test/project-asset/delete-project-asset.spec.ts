import {
  adminAuthHeader,
  AppDbResetService,
  TestAgent,
  testagent,
  userAuthHeader,
} from '../helpers'
import fs from 'fs'
import { testConfig } from '../test.config'
import { beforeAll, beforeEach, describe, it } from 'vitest'
import { AssetContentType, ICreateAssetRequest, ICreateAssetResponse } from '@app/types'

describe('Delete Project Asset', () => {
  const testEndpoint = '/api/project-assets'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let userAuth: string
  let adminPayload: ICreateAssetRequest
  let userPayload: ICreateAssetRequest
  let fileBuffer: Buffer

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
    fileBuffer = fs.readFileSync('./web/backend-test/test/assets/test-asset.jpg')
  }, 10000)

  beforeEach(async () => {
    await dbResetService.resetDb()
    adminAuth = adminAuthHeader()
    userAuth = userAuthHeader('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')

    adminPayload = {
      content_size: fileBuffer.length,
      content_type: AssetContentType.Jpeg,
      project_id: '3e42e273-546d-4989-a97c-f6eb173e8450',
    }
    userPayload = {
      content_size: fileBuffer.length,
      content_type: AssetContentType.Jpeg,
      project_id: '9e8f0c6f-1edf-4d68-a096-7a2bb4625c98',
    }
  })

  const createAsset = async (
    payload: ICreateAssetRequest,
    auth: string,
  ): Promise<ICreateAssetResponse> => {
    const resOwner = await api
      .post(testEndpoint)
      .set('Authorization', auth)
      .send(payload)
      .expect(201)

    return resOwner.body
  }

  describe('when requester is Admin', () => {
    it('returns 200 status code and message', async () => {
      const adminAsset = await createAsset(adminPayload, adminAuth)
      // Upload asset
      await testagent(adminAsset.signed_url).put('').send(fileBuffer).expect(200)

      await api
        .delete(`${testEndpoint}/${adminAsset.id}`)
        .set('Authorization', adminAuth)
        .expect(200)
    }, 10000)

    it('returns 200 status code and message when delete user asset', async () => {
      const userAsset = await createAsset(userPayload, userAuth)
      // Upload asset
      await testagent(userAsset.signed_url).put('').send(fileBuffer).expect(200)

      await api
        .delete(`${testEndpoint}/${userAsset.id}`)
        .set('Authorization', adminAuth)
        .expect(200)
    })
  }, 10000)

  describe('when requester is Owner', () => {
    it('returns 200 status code and message', async () => {
      const userAsset = await createAsset(userPayload, userAuth)
      // Upload asset
      await testagent(userAsset.signed_url).put('').send(fileBuffer).expect(200)

      await api
        .delete(`${testEndpoint}/${userAsset.id}`)
        .set('Authorization', userAuth)
        .expect(200)
    }, 10000)

    it('returns 403 status when delete admin asset', async () => {
      const adminAsset = await createAsset(adminPayload, adminAuth)
      return api
        .delete(`${testEndpoint}/${adminAsset.id}`)
        .set('Authorization', userAuth)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })

    it('returns 403 status when requester is not project owner', async () => {
      const userAsset = await createAsset(userPayload, userAuth)
      const newAuth = userAuthHeader('276168ed-9228-4d6b-aec2-ed53bb7c1901') // user

      return api
        .delete(`${testEndpoint}/${userAsset.id}`)
        .set('Authorization', newAuth)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })
  })

  describe('when request is invalid', () => {
    it('when project asset id does not exist', () => {
      const projectAssetId = '1c2e5d05-7fa3-416d-985b-4cb9ee3ca6c5'

      return api
        .delete(`${testEndpoint}/${projectAssetId}`)
        .set('Authorization', userAuth)
        .expect(404, {
          code: 'None',
          message: 'Project asset not found',
          status: 404,
        })
    })

    it('when user is not authorized', async () => {
      const adminAsset = await createAsset(adminPayload, adminAuth)
      return api.delete(`${testEndpoint}/${adminAsset.id}`).expect(401, {
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
      })
    })
  })
})
