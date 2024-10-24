import { ExecEnv } from '@app/types'
import convict from 'convict'

export const testConfig = convict({
  apiUrl: {
    doc: 'App API URL',
    format: String,
    default: 'http://127.0.0.1:3000',
    env: 'API_URL',
  },
  apiTestHelperUrl: {
    doc: 'API Test Helper URL',
    format: String,
    default: 'http://127.0.0.1:3001',
    env: 'API_TEST_HELPER_URL',
  },
  jobTestHelperUrl: {
    doc: 'Job Test Helper URL',
    format: String,
    default: 'http://127.0.0.1:3334',
    env: 'JOB_TEST_HELPER_URL',
  },
  execEnv: {
    doc: 'API execution environment ',
    format: Object.values(ExecEnv),
    default: ExecEnv.Development,
    env: 'EXEC_ENV',
  },
  jobApiKey: {
    format: String,
    env: 'JOBS_API_KEY',
    default: 'bdcf210b-3e68-4600-b915-9c6f7e1685b9',
  },
  confirmSharedSecret: {
    doc: 'Shared secret for user confirm tokens',
    format: String,
    default: 'pTHHvgH2P+ea/LzWMYJEYGZ3cbsRx9nO9RhPT5QeF+k=',
    env: 'CONFIRM_SHARED_SECRET',
  },
  appAuthSecret: {
    doc: 'Shared secret for app authorization',
    format: String,
    default: 'K0EKfNOtfZ8wTQB2UPydgN1wJXnOgmOXyJvIYDXVces=',
    env: 'APP_AUTH_SECRET',
  },
  authExpiresIn: {
    doc: 'Expiration for auth tokens',
    format: String,
    default: '30d',
    env: 'AUTH_EXPIRES_IN',
  },
})

testConfig.validate()
