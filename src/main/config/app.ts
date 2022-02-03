import express from 'express'
import setupMiddlewares from './middlewares'
import setUpRoutes from './routes'

const app = express()

setupMiddlewares(app)
setUpRoutes(app)
export default app
