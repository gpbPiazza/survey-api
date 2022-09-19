import { AccessDeniedError } from '../errors'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'
import { forbbiden } from '../helpers/http/http-helper'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest?.headers) return await new Promise(resolve => resolve(forbbiden(new AccessDeniedError())))

    return await new Promise(resolve => resolve(null))
  }
}
