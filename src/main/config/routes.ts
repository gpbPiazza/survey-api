import { Express, Router } from 'express'
import loginRoutes from '../routes/login/login-routes'
import surveysRoutes from '../routes/survey/survey-routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  loginRoutes(router)
  surveysRoutes(router)
}
