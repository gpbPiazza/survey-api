import { loginPath } from './paths'
import { loginParamsSchema, errorSchema, accountSchema } from './schemas'
import { anauthorized, badRequest } from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Survey API is system provides admin users to create surveys with answers and common users to answer then',
    version: '1.1.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest: badRequest,
    anauthorized: anauthorized
  }
}
