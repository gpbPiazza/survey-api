import { Express } from 'express'
import { cors, bodyParser } from '../middlewares'

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
