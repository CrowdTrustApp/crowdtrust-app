import {
  IUpdateProjectApiResponse,
  IUpdateProjectApiRequest,
  ProjectCategory,
  ProjectStatus,
} from '@app/types'
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

describe('Update Project', () => {
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let adminAuth: string
  let userAuth: string
  let projectId: string
  let payload: IUpdateProjectApiRequest

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
  })

  describe('when requestor is Admin', () => {
    test('return 200 when updating project name', async () => {
      payload = { name: 'Hello Project!' }

      const response = await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', adminAuth)
        .send(payload)
        .expect(200)

      const body: IUpdateProjectApiResponse = response.body
      expect(body.name).toEqual(payload.name)
    })

    test('return 200 when updating project status', async () => {
      payload = { status: ProjectStatus.Approved }

      const response = await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', adminAuth)
        .send(payload)
        .expect(200)

      const body: IUpdateProjectApiResponse = response.body
      expect(body.status).toEqual(payload.status)
    })

    test('return 200 when updating all project properties', async () => {
      payload = {
        name: 'New name',
        description: 'New description',
        blurb: 'New blurb',
        payment_address: '0x886ffe3d8b8851ecdf48888d9c630afd95c85fd1',
        category: ProjectCategory.Music,
        funding_goal: '11000000000000000000',
        start_time: now() + dayToSec(180),
        duration: dayToSec(25),
      }

      const response = await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', adminAuth)
        .send(payload)
        .expect(200)

      const body: IUpdateProjectApiResponse = response.body
      expect(body.name).toEqual(payload.name)
      expect(body.description).toEqual(payload.description)
      expect(body.blurb).toEqual(payload.blurb)
      expect(body.payment_address).toEqual(payload.payment_address)
      expect(body.category).toEqual(payload.category)
      expect(body.funding_goal).toEqual(payload.funding_goal)
      expect(body.start_time).toEqual(payload.start_time)
      expect(body.duration).toEqual(payload.duration)
    })
  })

  describe('when requestor is User', () => {
    test('return 200 when updating all project properties', async () => {
      payload = {
        name: 'New name',
        description: 'New description',
        blurb: 'New blurb',
        payment_address: '0x886ffe3d8b8851ecdf48888d9c630afd95c85fd1',
        category: ProjectCategory.Music,
        funding_goal: '11000000000000000000',
        start_time: now() + dayToSec(180),
        duration: dayToSec(25),
      }

      const response = await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(200)

      const body: IUpdateProjectApiResponse = response.body
      expect(body.name).toEqual(payload.name)
      expect(body.description).toEqual(payload.description)
      expect(body.blurb).toEqual(payload.blurb)
      expect(body.payment_address).toEqual(payload.payment_address)
      expect(body.category).toEqual(payload.category)
      expect(body.funding_goal).toEqual(payload.funding_goal)
      expect(body.start_time).toEqual(payload.start_time)
      expect(body.duration).toEqual(payload.duration)
    })

    test('updates project assets_order', async () => {
      payload = {
        assets_order: [
          'b59ba8f3-3b53-426a-b3db-52b2f8557798',
          '439f93a5-bbb6-4353-b3aa-0f766612dc53',
        ],
      }
      await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(200)
    })

    test('updates project rewards_order', async () => {
      payload = {
        assets_order: [
          '950d06e5-8c8b-4060-a6e4-7a676fbc223e',
          '1ab089a5-89eb-458f-bf04-15518e9e866f',
        ],
      }
      await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(200)
    })

    test('return 400 when changing fields in active status', async () => {
      userAuth = userAuthHeader('00e8ee0b-843b-43e7-84c1-6d7a64cd5cfd')
      projectId = '3e42e273-546d-4989-a97c-f6eb173e8450'
      payload = { name: 'NEW NAME' }

      await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'ProjectActive',
          message: 'Failed to validate request',
          status: 400,
        })

      payload = { start_time: now() + dayToSec(10) }
      await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'ProjectStart',
          message: 'Failed to validate request',
          status: 400,
        })
      payload = { funding_goal: '10000000' }

      await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'ProjectActive',
          message: 'Failed to validate request',
          status: 400,
        })
    })

    test('return 400 when start_time is invalid', async () => {
      payload = { start_time: now() - 10000 }

      await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          code: 'ProjectStart',
          message: 'Failed to validate request',
          status: 400,
        })
    })

    test('return 403 when user attempts to directly update status', async () => {
      payload = { status: ProjectStatus.Active }

      await api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(403, {
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })

    test('return 403 when requestor does not own project', async () => {
      const otherUserAuth = userAuthHeader('276168ed-9228-4d6b-aec2-ed53bb7c1901')

      return api
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', otherUserAuth)
        .send(payload)
        .expect({
          code: 'None',
          message: 'Forbidden',
          status: 403,
        })
    })
  })

  test('returns 404 code when project does not exist', () => {
    const id = 'cbd7a9ff-18f5-489e-b61e-cdd4a1394968'

    return api
      .patch(`/api/projects/${id}`)
      .set('Authorization', adminAuth)
      .send(payload)
      .expect({
        code: 'None',
        message: `Project with ID ${id} not found`,
        status: 404,
      })
  })

  test('returns 401 when user is not authorized', async () => {
    await api.patch(`/api/projects/${projectId}`).expect(401, {
      code: 'Unauthorized',
      message: 'Unauthorized',
      status: 401,
    })
  })
})
