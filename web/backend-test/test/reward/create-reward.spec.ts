import {
  ICreateRewardApiRequest,
  ICreateRewardApiResponse,
  IGetProjectApiResponse,
} from '@app/types'
import { commonRegex } from '@app/util'
import {
  adminAuthHeader,
  AppDbResetService,
  dayToSec,
  now,
  testagent,
  TestAgent,
  userAuthHeader,
} from '../helpers'
import { testConfig } from '../test.config'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'

describe('Create Reward', () => {
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let payload: ICreateRewardApiRequest
  let projectId: string
  let adminAuth: string
  let userAuth: string

  const testEndpoint = () => `/api/projects/${projectId}/rewards`

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
    adminAuth = adminAuthHeader()
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
    projectId = '14bfe82a-1003-446b-b6bb-20a176e848e0'
    payload = {
      name: 'My New Project',
      description: 'Welcome to my new project, it is very nice',
      price: '1000000000000000000',
      delivery_time: now() + dayToSec(90),
      backer_limit: 100,
    }
  })

  const verifyReward = async (projectId: string, rewardId: string, auth: string) => {
    const response = await api
      .get(`/api/projects/${projectId}`)
      .set('Authorization', auth)
      .expect(200)

    const body: IGetProjectApiResponse = response.body
    const reward = body.rewards.find((r) => r.id === rewardId)
    expect(reward).toBeDefined()
    expect(reward?.name).toEqual(payload.name)
    expect(reward?.description).toEqual(payload.description)
    expect(reward?.price).toEqual(payload.price)
    expect(reward?.delivery_time).toEqual(payload.delivery_time)
    expect(reward?.backer_count).toEqual(0)
    expect(reward?.backer_limit).toEqual(payload.backer_limit)
  }

  test('admin creates reward', async () => {
    const response = await api
      .post(testEndpoint())
      .set('Authorization', adminAuth)
      .send(payload)
      .expect(201)
    const body: ICreateRewardApiResponse = response.body

    expect(body.id).toMatch(new RegExp(commonRegex.uuid))
    await verifyReward(projectId, body.id, adminAuth)
  })

  test('user creates reward', async () => {
    const response = await api
      .post(testEndpoint())
      .set('Authorization', userAuth)
      .send(payload)
      .expect(201)
    const body: ICreateRewardApiResponse = response.body

    expect(body.id).toMatch(new RegExp(commonRegex.uuid))
    await verifyReward(projectId, body.id, adminAuth)
  })

  describe('when request is not valid', () => {
    test('returns 400 code when name length is invalid', async () => {
      // Name too short
      payload.name = 'a'
      await api.post(testEndpoint()).set('Authorization', userAuth).send(payload).expect({
        status: 400,
        message: 'Failed to validate request',
        code: 'InvalidFormData',
      })

      // Name too long
      payload.name = '12345678901234567890123456789012345678901234567890zabcdefghijklm'
      return api
        .post(testEndpoint())
        .set('Authorization', userAuth)
        .send(payload)
        .expect({
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })
    })

    test('when description length is invalid', () => {
      payload.description = '1234'

      return api
        .post(testEndpoint())
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })
    })

    test('when delivery_time is invalid', async () => {
      payload.delivery_time = now() - 1000
      await api
        .post(testEndpoint())
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Delivery time must be after current time',
          code: 'RewardDelivery',
        })
    })

    test('when backer_limit is invalid', async () => {
      // Too short
      payload.backer_limit = -1
      await api
        .post(testEndpoint())
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })

      // Too long
      payload.backer_limit = 2000000000
      await api
        .post(testEndpoint())
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })
    })

    test('returns 401 when user is not authorized', async () => {
      await api.post(testEndpoint()).expect(401, {
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
      })
    })
  })
})
