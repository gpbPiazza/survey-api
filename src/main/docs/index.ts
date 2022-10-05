import { loginPath, signUpPath, surveyResultPath, surveysPath } from './paths'
import { loginParamsSchema, errorSchema, accountSchema, surveySchema, surveyAnswerSchema, surveysSchema, apiKeyAuthSchema, signUpParamsSchema, postSurveyParamsSchema, resultSurveyParamsSchema, surveyResultSchema } from './schemas'
import { anauthorized, badRequest, forbidden } from './components'

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
  tags: [
    {
      name: 'Login'
    }, {
      name: 'Surveys'
    }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveysPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    postSurveyParams: postSurveyParamsSchema,
    resultSurveyParams: resultSurveyParamsSchema,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest: badRequest,
    anauthorized: anauthorized,
    forbidden: forbidden
  }
}
