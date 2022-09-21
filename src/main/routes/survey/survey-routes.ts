/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../../factories/controllers/survey/add-survey/add-survey-factory'
import { makeLoadSurveysController } from '../../factories/controllers/survey/load-survey/load-survey-factory'
import { adminAuth } from '../../middlewares/auth/admintAuth'
import { auth } from '../../middlewares/auth/auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
