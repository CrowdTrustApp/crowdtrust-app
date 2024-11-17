import {
  AssetContentType,
  AssetState,
  ICreateAssetRequest,
  ICreateAssetResponse,
  IListAssetsRequest,
  IListAssetsResponse,
  IVerifyAssetResponse,
  SortDirection,
} from '@app/types'
import { beforeAll, beforeEach, describe, it, expect } from 'vitest'
import { AppDbResetService, testagent, TestAgent, userAuthHeader } from '../helpers'
import fs from 'fs'
import { testConfig } from '../test.config'

describe('Verify Project Asset', () => {
  const testEndpoint = '/api/project-assets'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let userId: string
  let userAuth: string
  let fileBuffer: Buffer

  let projectAsset: ICreateAssetResponse

  function verifyEndpoint(assetId: string): string {
    return `${testEndpoint}/${assetId}/actions/verify`
  }

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    userId = '45013993-2a1a-4ee5-8dbd-b4b63d9af34f'
    userAuth = userAuthHeader(userId)

    fileBuffer = fs.readFileSync('./web/backend-test/test/assets/test-asset.jpg')

    const payload: ICreateAssetRequest = {
      content_size: fileBuffer.length,
      content_type: AssetContentType.Jpeg,
      project_id: '14bfe82a-1003-446b-b6bb-20a176e848e0',
    }

    const response = await api
      .post(testEndpoint)
      .set('Authorization', userAuth)
      .send(payload)
      .expect(201)

    projectAsset = response.body
  })

  it('returns 200 status code and message', async () => {
    // Upload asset
    await testagent(projectAsset.signed_url).put('').send(fileBuffer).expect(200)

    const response = await api
      .post(verifyEndpoint(projectAsset.id))
      .set('Authorization', userAuth)
      .expect(200)

    const body: IVerifyAssetResponse = response.body
    expect(body.verified).toEqual(true)

    // Check latest project asset
    const query: IListAssetsRequest = {
      user_id: userId,
      column: 'created_at',
      direction: SortDirection.Desc,
    }

    const listResponse = await api
      .get(testEndpoint)
      .query(query)
      .set('Authorization', userAuth)
      .expect(200)
    const listBody: IListAssetsResponse = listResponse.body
    const projects = listBody.results

    expect(projects[0].id).toEqual(projectAsset.id)
    expect(projects[0].state).toEqual(AssetState.Uploaded)
  }, 10000)

  describe('when request is invalid', () => {
    it('when user requester is not project owner', () => {
      const newAuth = userAuthHeader('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')

      return api
        .post(verifyEndpoint(projectAsset.id))
        .set('Authorization', newAuth)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })

    it('when project asset id does not exist', () => {
      const projectAssetId = '1c2e5d05-7fa3-416d-985b-4cb9ee3ca6c5'

      return api
        .post(verifyEndpoint(projectAssetId))
        .set('Authorization', userAuth)
        .expect(404, {
          code: 'None',
          message: 'Project asset not found',
          status: 404,
        })
    })

    it('when user is not authorized', () => {
      return api.post(verifyEndpoint(projectAsset.id)).expect(401, {
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
      })
    })
  })
})
