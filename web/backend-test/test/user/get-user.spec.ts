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
      expect(body.eth_address).toEqual('0xbc79345f5d78d2fd2ba5c2d3b3579c7548234ae5')
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
      expect(body.eth_address).toEqual('0x886ffe3d8b8851ecdf48888d9c630afd95c85fd1')
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

    test('returns another user with limited fields', async () => {
      const otherUserId = '276168ed-9228-4d6b-aec2-ed53bb7c1901'
      const res = await api
        .get(`${testEndpoint}/${otherUserId}`)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IGetUserApiResponse = res.body

      expect(body.id).toEqual(otherUserId)
      expect(body.eth_address).toEqual('0x0000000000000000000000000000000000000002')
      expect(body.email).toBeUndefined()
      expect(body.email_confirmed).toBeUndefined()
    })

    test('returns limited fields when user gets an admin', async () => {
      const res = await api
        .get(`${testEndpoint}/${adminId}`)
        .set('Authorization', userAuth)
        .expect(200)
      const body: IGetUserApiResponse = res.body

      expect(body.id).toEqual(adminId)
      expect(body.eth_address).toEqual('0xbc79345f5d78d2fd2ba5c2d3b3579c7548234ae5')
      expect(body.email).toBeUndefined()
      expect(body.email_confirmed).toBeUndefined()
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
