import { IGetUserApiResponse, UserType } from '@app/types'
import { testagent, TestAgent, AppDbResetService } from '../helpers'
import { describe, expect, test, beforeAll, beforeEach } from 'vitest'
import {
  adminAuthHeader,
  expiredAdminToken,
  expiredUser1Token,
  userAuthHeader,
} from '../helpers'
import { testConfig } from '../test.config'

describe('Get User', () => {
  const testEndpoint = '/api/users'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let userAuth: string
  const adminId = 'f481a6d5-ad06-4c3e-b3a5-4af0be50bb29'
  const userId = '45013993-2a1a-4ee5-8dbd-b4b63d9af34f'

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    adminAuth = adminAuthHeader()
    userAuth = userAuthHeader(userId)
  })

  describe('when requester is Admin', () => {
    test('returns 200 and message when get an admin user', async () => {
      const response = await api
        .get(`${testEndpoint}/${adminId}`)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IGetUserApiResponse = response.body

      expect(body.id).toEqual(adminId)
      expect(body.name).toEqual('Admin')
      expect(body.description).toEqual('The Admin')
      expect(body.link).toEqual('https://crowdtrust.app')
      expect(body.location).toEqual('Singapore')
      expect(body.email).toEqual('admin1@crowdtrust.app')
      expect(body.eth_address).toEqual('0x0000000000000000000000000000000000000000')
      expect(body.user_type).toEqual('Admin')
      expect(body.email_confirmed).toEqual(true)
    })

    test('returns 200 and message when get an user user', async () => {
      const response = await api
        .get(`${testEndpoint}/${userId}`)
        .set('Authorization', adminAuth)
        .expect(200)

      const body: IGetUserApiResponse = response.body

      expect(body.id).toEqual(userId)
      expect(body.name).toEqual('user1@crowdtrust.app')
      expect(body.description).toEqual('The first user ever!')
      expect(body.link).toEqual(
        'https://crowdtrust.app/user/45013993-2a1a-4ee5-8dbd-b4b63d9af34f',
      )
      expect(body.location).toEqual('Tokyo')
      expect(body.email).toEqual('user1@crowdtrust.app')
      expect(body.eth_address).toEqual('0x0bfcaae5Abf40A828e6b37379F99dCbEDA712345')
      expect(body.user_type).toEqual(UserType.User)
      expect(body.email_confirmed).toEqual(true)
    })

    test('returns 401 when admin token has expired', async () => {
      await api
        .get(`${testEndpoint}/${userId}`)
        .set('Authorization', expiredAdminToken)
        .expect(401, {
          code: 'InvalidAuth',
          message: 'Unauthorized',
          status: 401,
        })
    })
  })

  describe('when requester is User', () => {
    test('returns 200 and message when get an user user', async () => {
      const response = await api
        .get(`${testEndpoint}/${userId}`)
        .set('Authorization', userAuth)
        .expect(200)

      const body: IGetUserApiResponse = response.body

      expect(body.id).toEqual(userId)
      expect(body.email).toEqual('user1@crowdtrust.app')
      expect(body.user_type).toEqual(UserType.User)
      expect(body.email_confirmed).toEqual(true)
    })

    test('returns 401 when user token has expired', async () => {
      await api
        .get(`${testEndpoint}/${userId}`)
        .set('Authorization', expiredUser1Token)
        .expect(401, {
          code: 'InvalidAuth',
          message: 'Unauthorized',
          status: 401,
        })
    })

    test('returns 403 error when user user gets another user', async () => {
      const otherUserId = '0c069253-e45d-487c-b7c0-cbe467c33a10'
      await api
        .get(`${testEndpoint}/${otherUserId}`)
        .set('Authorization', userAuth)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })

    test('returns 403 error when user user gets an admin user', async () => {
      await api
        .get(`${testEndpoint}/${adminId}`)
        .set('Authorization', userAuth)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })
  })

  test('returns 401 when user is not authorized', async () => {
    await api.get(`${testEndpoint}/${adminId}`).expect(401, {
      code: 'Unauthorized',
      message: 'Unauthorized',
      status: 401,
    })
  })

  test('returns 404 when user does not exist', async () => {
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
