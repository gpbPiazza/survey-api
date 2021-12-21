import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser)
}
