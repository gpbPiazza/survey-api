/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adaptRoute } from '../../adapters/express/express-route-adapter'
import { makeSaveSurveyResultController } from '../../factories/controllers/survey-result/save-survey-result/save-survey-result-factory'
import { auth } from '../../middlewares/auth/auth'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
