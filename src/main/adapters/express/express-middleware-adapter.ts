import { HttpRequest, HttpResponse, Middleware } from '../../../presentation/protocols'
import { NextFunction, Request, Response } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse: HttpResponse = await middleware.handle(httpRequest)

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    }

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
