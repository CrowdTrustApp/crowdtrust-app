import { IGetProjectApiResponse, IUpdateRewardApiRequest } from '@app/types'
import {
  testagent,
  TestAgent,
  adminAuthHeader,
  userAuthHeader,
  AppDbResetService,
  now,
  dayToSec,
} from '../helpers'
import { testConfig } from '../test.config'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'

describe('Update Reward', () => {
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let userAuth: string
  let rewardId: string
  let projectId: string
  let payload: IUpdateRewardApiRequest

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    adminAuth = adminAuthHeader()
    userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
    projectId = '14bfe82a-1003-446b-b6bb-20a176e848e0'
    rewardId = '950d06e5-8c8b-4060-a6e4-7a676fbc223e'
  })

  const verifyReward = async (projectId: string, rewardId: string, auth: string) => {
    const response = await api
      .get(`/api/projects/${projectId}`)
      .set('Authorization', auth)
      .expect(200)

    const body: IGetProjectApiResponse = response.body
    const reward = body.rewards.find((r) => r.id === rewardId)
    expect(reward).toBeDefined()
    if (payload.name) {
      expect(reward?.name).toEqual(payload.name)
    }
    if (payload.description) {
      expect(reward?.description).toEqual(payload.description)
    }
    if (payload.price) {
      expect(reward?.price).toEqual(payload.price)
    }
    if (payload.delivery_time) {
      expect(reward?.delivery_time).toEqual(payload.delivery_time)
    }
    expect(reward?.backer_count).toEqual(0)
    if (payload.backer_limit) {
      expect(reward?.backer_limit).toEqual(payload.backer_limit)
    }
  }

  describe('when requestor is Admin', () => {
    test('return 200 when updating reward name', async () => {
      payload = { name: 'Hello Reward!' }

      await api
        .patch(`/api/rewards/${rewardId}`)
        .set('Authorization', adminAuth)
        .send(payload)
        .expect(200)

      await verifyReward(projectId, rewardId, adminAuth)
    })

    test('return 200 when updating all reward properties', async () => {
      payload = {
        name: 'New name',
        description: 'New description',
        price: '100000000000000000',
        delivery_time: now() + dayToSec(180),
        backer_limit: 1000,
        visible: false,
      }

      await api
        .patch(`/api/rewards/${rewardId}`)
        .set('Authorization', adminAuth)
        .send(payload)
        .expect(200)

      await verifyReward(projectId, rewardId, adminAuth)
    })
  })

  describe('when requestor is User', () => {
    test('return 200 when updating all reward properties', async () => {
      payload = {
        name: 'New name',
        description: 'New description',
        price: '100000000000000000',
        delivery_time: now() + dayToSec(180),
        backer_limit: 1000,
        visible: false,
      }

      await api
        .patch(`/api/rewards/${rewardId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(200)

      await verifyReward(projectId, rewardId, userAuth)
    })

    test('return 400 when start_time is invalid', async () => {
      payload = { delivery_time: now() - 10000 }

      await api
        .patch(`/api/rewards/${rewardId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'RewardDelivery',
          message: 'Failed to validate request',
          status: 400,
        })
    })

    test('return 400 when changing fields in complete status', async () => {
      userAuth = userAuthHeader('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')
      rewardId = 'f99aa7f1-fc8a-4073-aff7-beaa1bbdfb3a'
      payload = { name: 'NEW NAME' }

      await api
        .patch(`/api/rewards/${rewardId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'ProjectActive',
          message: 'Failed to validate request',
          status: 400,
        })

      payload = { delivery_time: now() + dayToSec(10) }
      await api
        .patch(`/api/rewards/${rewardId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'ProjectActive',
          message: 'Failed to validate request',
          status: 400,
        })

      payload = { price: '10000000' }
      await api
        .patch(`/api/rewards/${rewardId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'ProjectActive',
          message: 'Failed to validate request',
          status: 400,
        })
    })

    test('return 403 when requestor does not own reward', async () => {
      payload = { name: 'My Reward!' }
      const otherUserAuth = userAuthHeader('276168ed-9228-4d6b-aec2-ed53bb7c1901')

      return api
        .patch(`/api/rewards/${rewardId}`)
        .set('Authorization', otherUserAuth)
        .send(payload)
        .expect({
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })
  })

  test('returns 404 code when reward does not exist', () => {
    payload = { name: 'Reward?' }
    const id = 'cbd7a9ff-18f5-489e-b61e-cdd4a1394968'

    return api
      .patch(`/api/rewards/${id}`)
      .set('Authorization', adminAuth)
      .send(payload)
      .expect({
        code: 'None',
        message: `Reward with ID ${id} not found`,
        status: 404,
      })
  })

  test('returns 401 when user is not authorized', async () => {
    await api.patch(`/api/rewards/${rewardId}`).expect(401, {
      code: 'Unauthorized',
      message: 'Unauthorized',
      status: 401,
    })
  })
})
