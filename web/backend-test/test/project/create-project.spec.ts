import {
  ICreateProjectApiRequest,
  ICreateProjectApiResponse,
  IGetProjectApiResponse,
  ProjectCategory,
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

describe('Create Project', () => {
  const testEndpoint = '/api/projects'
  let api: TestAgent
  let testHelperApiUrl: string
  let dbResetService: AppDbResetService
  let payload: ICreateProjectApiRequest
  let adminAuth: string
  let userAuth: string

  beforeAll(() => {
    api = testagent(testConfig.get('apiUrl'))
    testHelperApiUrl = testConfig.get('apiTestHelperUrl')
    dbResetService = new AppDbResetService(testHelperApiUrl)
    adminAuth = adminAuthHeader()
  })

  beforeEach(async () => {
    await dbResetService.resetDb()
    userAuth = userAuthHeader('45013993-2a1a-4ee5-8dbd-b4b63d9af34f')
    payload = {
      name: 'My New Project',
      description: 'Welcome to my new project, it is very nice',
      blurb: 'A very nice thing',
      category: ProjectCategory.ArtDesign,
      funding_goal: '1000000000000000000',
      start_time: now() + dayToSec(1),
      duration: dayToSec(60),
    }
  })

  const verifyProject = async (id: string, auth: string) => {
    const response = await api
      .get(`${testEndpoint}/${id}`)
      .set('Authorization', auth)
      .expect(200)

    const body: IGetProjectApiResponse = response.body
    expect(body.name).toEqual(payload.name)
    expect(body.description).toEqual(payload.description)
    expect(body.blurb).toEqual(payload.blurb)
    expect(body.category).toEqual(payload.category)
    expect(body.funding_goal).toEqual(payload.funding_goal)
    expect(body.start_time).toEqual(payload.start_time)
    expect(body.duration).toEqual(payload.duration)
  }

  test('admin creates project', async () => {
    const response = await api
      .post(testEndpoint)
      .set('Authorization', adminAuth)
      .send(payload)
      .expect(201)
    const body: ICreateProjectApiResponse = response.body

    expect(body.id).toMatch(new RegExp(commonRegex.uuid))
    await verifyProject(body.id, adminAuth)
  })

  test('user creates project', async () => {
    const response = await api
      .post(testEndpoint)
      .set('Authorization', userAuth)
      .send(payload)
      .expect(201)
    const body: ICreateProjectApiResponse = response.body

    expect(body.id).toMatch(new RegExp(commonRegex.uuid))
  })

  describe('when request is not valid', () => {
    test('returns 400 code when name length is invalid', async () => {
      // Name too short
      payload.name = 'a'
      await api.post(testEndpoint).set('Authorization', userAuth).send(payload).expect({
        status: 400,
        message: 'Failed to validate request',
        code: 'InvalidFormData',
      })

      // Name too long
      payload.name = '12345678901234567890123456789012345678901234567890zabcdefghijklm'
      return api.post(testEndpoint).set('Authorization', userAuth).send(payload).expect({
        status: 400,
        message: 'Failed to validate request',
        code: 'InvalidFormData',
      })
    })

    test('when description length is invalid', () => {
      payload.description = '1234'

      return api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })
    })

    test('when blurb length is invalid', () => {
      payload.blurb = 'a'

      return api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })
    })

    test('when category is invalid', () => {
      payload.category = 'a' as ProjectCategory

      return api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to deserialize the JSON body into the target type',
          code: 'InvalidFormData',
        })
    })

    test('when start_time is invalid', async () => {
      payload.start_time = now() - 1000
      await api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Start time must be after current time',
          code: 'ProjectStart',
        })
    })

    test('when duration is invalid', async () => {
      // Too short
      payload.duration = 86399
      await api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })

      // Too long
      payload.duration = 7776001
      await api
        .post(testEndpoint)
        .set('Authorization', userAuth)
        .send(payload)
        .expect(400, {
          status: 400,
          message: 'Failed to validate request',
          code: 'InvalidFormData',
        })
    })

    test('returns 400 code when name already exists', () => {
      // Try to create a project with the same name as a project from fixtures
      payload.name = 'Super Jetpack'
      return api.post(testEndpoint).set('Authorization', userAuth).send(payload).expect({
        code: 'ProjectExists',
        message: 'Project with name already exists',
        status: 400,
      })
    })

    test('returns 401 when user is not authorized', async () => {
      await api.post(testEndpoint).expect(401, {
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
      })
    })
  })
})
