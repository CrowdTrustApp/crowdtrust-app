import {
  BlockchainStatus,
  IListPledgesApiResponse,
  IUpdatePledgeApiRequest,
} from '@app/types'
import {
  testagent,
  TestAgent,
  adminAuthHeader,
  userAuthHeader,
  AppDbResetService,
} from '../helpers'
import { testConfig } from '../test.config'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'

describe('Update Pledge', () => {
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let userAuth: string
  let pledgeId: string
  let projectId: string
  let payload: IUpdatePledgeApiRequest

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    adminAuth = adminAuthHeader()
    userAuth = userAuthHeader('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')
    projectId = '14bfe82a-1003-446b-b6bb-20a176e848e0'
    pledgeId = 'ac69089a-fbe6-4879-bbb2-ced6446092c0'
  })

  const verifyPledge = async (projectId: string, pledgeId: string, auth: string) => {
    const response = await api
      .get('/api/pledges')
      .query({ project_id: projectId })
      .set('Authorization', auth)
      .expect(200)

    const body: IListPledgesApiResponse = response.body
    const pledge = body.results.find((r) => r.id === pledgeId)
    expect(pledge).toBeDefined()
    if (payload.comment) {
      expect(pledge?.comment).toEqual(payload.comment)
    }
    if (payload.blockchain_status) {
      expect(pledge?.blockchain_status).toEqual(payload.blockchain_status)
    }
    if (payload.transaction_hash) {
      expect(pledge?.transaction_hash).toEqual(payload.transaction_hash)
    }
  }

  describe('when requestor is Admin', () => {
    test('return 200 when updating pledge comment', async () => {
      payload = { comment: 'Hello Pledge!' }

      await api
        .patch(`/api/pledges/${pledgeId}`)
        .set('Authorization', adminAuth)
        .send(payload)
        .expect(200)

      await verifyPledge(projectId, pledgeId, adminAuth)
    })

    test('return 200 when updating blockchain properties', async () => {
      payload = {
        blockchain_status: BlockchainStatus.Pending,
        transaction_hash:
          '0x123454292f1680730fe8803949c8ddf9fbe8256da1ff86bc9b304b35a3f00000',
      }

      await api
        .patch(`/api/pledges/${pledgeId}`)
        .set('Authorization', adminAuth)
        .send(payload)
        .expect(200)

      await verifyPledge(projectId, pledgeId, adminAuth)
    })
  })

  describe('when requestor is User', () => {
    test('return 200 when updating all pledge properties', async () => {
      payload = {
        comment: 'New comment',
        blockchain_status: BlockchainStatus.Pending,
        transaction_hash:
          '0x123454292f1680730fe8803949c8ddf9fbe8256da1ff86bc9b304b35a3f00000',
      }

      await api
        .patch(`/api/pledges/${pledgeId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(200)

      await verifyPledge(projectId, pledgeId, adminAuth)
    })

    test('return 400 when blockchain_status is invalid', async () => {
      payload = { blockchain_status: 'ok' as BlockchainStatus }

      await api
        .patch(`/api/pledges/${pledgeId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'InvalidFormData',
          message: 'Failed to deserialize the JSON body into the target type',
          status: 400,
        })
    })

    test('return 400 when transaction_hash is invalid', async () => {
      payload = {
        transaction_hash: '0x1234540',
      }

      await api
        .patch(`/api/pledges/${pledgeId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'InvalidFormData',
          message: 'Failed to validate request',
          status: 400,
        })
    })

    test('return 403 when requestor does not own pledge', async () => {
      payload = { comment: 'My Pledge!' }
      const otherUserAuth = userAuthHeader('276168ed-9228-4d6b-aec2-ed53bb7c1901')

      return api
        .patch(`/api/pledges/${pledgeId}`)
        .set('Authorization', otherUserAuth)
        .send(payload)
        .expect({
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })
  })

  test('returns 404 code when pledge does not exist', () => {
    payload = { comment: 'Pledge?' }
    const id = 'cbd7a9ff-18f5-489e-b61e-cdd4a1394968'

    return api
      .patch(`/api/pledges/${id}`)
      .set('Authorization', adminAuth)
      .send(payload)
      .expect({
        code: 'None',
        message: `Pledge with ID ${id} not found`,
        status: 404,
      })
  })

  test('returns 401 when user is not authorized', async () => {
    await api.patch(`/api/pledges/${pledgeId}`).expect(401, {
      code: 'Unauthorized',
      message: 'Unauthorized',
      status: 401,
    })
  })
})
