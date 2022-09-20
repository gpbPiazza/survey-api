/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptMiddleware } from '../../adapters/express/express-middleware-adapter'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../../factories/controllers/survey/add-survey-factory'
import { makeAuthMiddleware } from '../../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
