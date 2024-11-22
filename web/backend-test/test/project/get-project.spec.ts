import {
  BlockchainStatus,
  IGetProjectApiResponse,
  PaymentCurrency,
  ProjectCategory,
  ProjectStatus,
} from '@app/types'
import { testagent, TestAgent, AppDbResetService } from '../helpers'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'
import { adminAuthHeader, userAuthHeader } from '../helpers'
import { testConfig } from '../test.config'
import { commonRegex } from '@app/util'

describe('Get User', () => {
  const testEndpoint = '/api/projects'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let projectId: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
    adminAuth = adminAuthHeader()
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    projectId = '14bfe82a-1003-446b-b6bb-20a176e848e0'
  })

  describe('when requester is Admin', () => {
    test('returns 200 and project', async () => {
      const response = await api
        .get(`${testEndpoint}/${projectId}`)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IGetProjectApiResponse = response.body
      expect(body.id).toEqual(projectId)
      expect(body.user_id).toEqual('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
      expect(body.name).toEqual('Game Box')
      expect(body.description).toContain('A revolutionary new handheld gaming device')
      expect(body.blurb).toEqual('Revolutionizing handheld gaming!')
      expect(body.contract_address).toEqual('0x0000000000000000000000000000000000000000')
      expect(body.payment_address).toEqual('0x0000000000000000000000000000000000000000')
      expect(body.category).toEqual(ProjectCategory.Games)
      expect(body.funding_goal).toEqual('10000000000000000000')
      expect(body.start_time).toBeGreaterThan(0)
      expect(body.duration).toEqual(30 * 24 * 60 * 60)
      expect(body.total_pledged).toEqual('0')
      expect(body.backer_count).toEqual(0)
      expect(body.base_currency).toEqual(PaymentCurrency.Ethereum)
      expect(body.status).toEqual(ProjectStatus.Initial)
      expect(body.blockchain_status).toEqual(BlockchainStatus.None)
      expect(body.transaction_hash).toBeNull()
      expect(body.rewards_order).toEqual([])
      expect(body.assets).toHaveLength(2)
      expect(body.assets_order).toEqual([
        '7d9cb4c7-06c3-4de4-a77c-4311386387c6',
        'b59ba8f3-3b53-426a-b3db-52b2f8557798',
        '4cba9ed0-eb4e-4764-8458-a4ca6eecb35c',
        '439f93a5-bbb6-4353-b3aa-0f766612dc53',
      ])
      expect(body.created_at).toMatch(new RegExp(commonRegex.date))
      expect(body.updated_at).toMatch(new RegExp(commonRegex.date))
    })

    test('returns project with relations', async () => {
      projectId = 'fa4d21c2-16a3-46cf-8162-98f4a82b59aa'

      const response = await api
        .get(`${testEndpoint}/${projectId}`)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IGetProjectApiResponse = response.body
      expect(body.id).toEqual(projectId)
      const rewards = body.rewards
      expect(rewards.length).toEqual(2)
      expect(rewards[0].id).toEqual('f99aa7f1-fc8a-4073-aff7-beaa1bbdfb3a')
      expect(rewards[0].name).toBeDefined()
      expect(rewards[0].description).toBeDefined()
      expect(rewards[0].delivery_time).toBeDefined()
      expect(rewards[0].price).toEqual('100000000000000000')
      expect(rewards[0].backer_limit).toEqual(400)
      expect(rewards[0].backer_count).toEqual(97)

      expect(rewards[1].id).toEqual('28046fdd-9e47-441d-8142-8f556e5d825c')
      expect(rewards[1].delivery_time).toBeDefined()
      expect(rewards[1].price).toEqual('200000000000000000')
      expect(rewards[1].backer_limit).toEqual(100)
      expect(rewards[1].backer_count).toEqual(0)
    })
  })

  describe('when requester is User', () => {
    let userAuth: string

    beforeEach(() => {
      userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
    })

    test('returns 200 and project when getting own project', async () => {
      const response = await api
        .get(`${testEndpoint}/${projectId}`)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IGetProjectApiResponse = response.body

      expect(body.id).toEqual(projectId)
      expect(body.user_id).toEqual('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
      expect(body.name).toEqual('Game Box')
      expect(body.created_at).toMatch(new RegExp(commonRegex.date))
      expect(body.updated_at).toMatch(new RegExp(commonRegex.date))
    })

    test('returns 200 and project when getting other active project', async () => {
      const otherProjectId = '0c9d3f3e-8027-4582-b573-99b2d6f87ebc'
      const response = await api
        .get(`${testEndpoint}/${otherProjectId}`)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IGetProjectApiResponse = response.body

      expect(body.id).toEqual(otherProjectId)
      expect(body.user_id).toEqual('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')
      expect(body.name).toEqual('Good Boot')
      expect(body.created_at).toMatch(new RegExp(commonRegex.date))
      expect(body.updated_at).toMatch(new RegExp(commonRegex.date))
    })

    test('returns 403 error when user gets another non-active user project', async () => {
      const otherProjectId = 'bbe3791a-96af-4de6-8796-5d2f5c8ca144'
      await api
        .get(`${testEndpoint}/${otherProjectId}`)
        .set('Authorization', userAuth)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })
  })

  test('returns 200 and project when getting active project', async () => {
    projectId = '0c9d3f3e-8027-4582-b573-99b2d6f87ebc'
    const response = await api.get(`${testEndpoint}/${projectId}`).expect(200)
    const body: IGetProjectApiResponse = response.body

    expect(body.id).toEqual(projectId)
    expect(body.user_id).toEqual('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')
    expect(body.name).toEqual('Good Boot')
    expect(body.created_at).toMatch(new RegExp(commonRegex.date))
    expect(body.updated_at).toMatch(new RegExp(commonRegex.date))
  })

  test('returns 403 error when getting a non-active project', async () => {
    await api.get(`${testEndpoint}/${projectId}`).expect(403, {
      code: 'None',
      message: 'Forbidden',
      status: 403,
    })
  })

  test('returns 404 when project does not exist', async () => {
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
