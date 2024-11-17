import { AssetContentType, ICreateAssetRequest, ICreateAssetResponse } from '@app/types'
import { AppDbResetService, TestAgent, testagent, userAuthHeader } from '../helpers'
import { testConfig } from '../test.config'
import { commonRegex } from '@app/util'
import { beforeAll, beforeEach, describe, expect, test } from 'vitest'

describe('Create Project Asset', () => {
  const testEndpoint = '/api/project-assets'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let payload: ICreateAssetRequest
  let userAuth: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
    payload = {
      content_size: 100000,
      content_type: AssetContentType.Jpeg,
      project_id: '14bfe82a-1003-446b-b6bb-20a176e848e0',
    }
  })

  test('returns 201 status code and signed url', async () => {
    const response = await api
      .post(testEndpoint)
      .set('Authorization', userAuth)
      .send(payload)
      .expect(201)

    const body: ICreateAssetResponse = response.body

    expect(body.id).toMatch(new RegExp(commonRegex.uuid))
    const uploadUrl = new URL(body.signed_url)
    expect(Object.keys(body)).toHaveLength(10)
    expect(body.project_id).toEqual(payload.project_id)
    expect(`${uploadUrl.protocol}//${uploadUrl.host}`).toMatch(commonRegex.assetUrl)
    expect(uploadUrl.pathname).toContain(`/${payload.project_id}/${body.id}.jpg`)
    expect(uploadUrl.searchParams.get('X-Amz-Expires')).toEqual('600')
    expect(uploadUrl.searchParams.get('X-Amz-Signature')?.length).toBeGreaterThan(20)
  })

  describe('when request is invalid', () => {
    test('when requester is not project owner', () => {
      payload.project_id = '00df0e23-22af-4959-874c-aca385b54eed'
      return api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })

    test('when user is not authorized', () => {
      return api.post(testEndpoint).send(payload).expect(401, {
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
      })
    })

    test('when content_size is not valid', async () => {
      payload.content_size = 1000000001

      await api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'InvalidFormData',
          message: 'Failed to validate request',
          status: 400,
        })

      payload.content_size = -1
      await api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'InvalidFormData',
          message: 'Failed to validate request',
          status: 400,
        })
    })

    test('when content_type is not valid', () => {
      payload.content_type = 'text/plain' as AssetContentType

      return api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'InvalidFormData',
          message: 'Failed to deserialize the JSON body into the target type',
          status: 400,
        })
    })
  })
})
