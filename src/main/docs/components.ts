import { anauthorized, badRequest, forbidden } from './components/'
import { apiKeyAuthSchema } from './schemas/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest: badRequest,
  anauthorized: anauthorized,
  forbidden: forbidden
}
