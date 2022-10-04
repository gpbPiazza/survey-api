import express from 'express'
import setupMiddlewares from './middlewares'
import setUpRoutes from './routes'
import setupAPIDoc from './config-swagger'

const app = express()
setupAPIDoc(app)
setupMiddlewares(app)
setUpRoutes(app)
export default app
