import { AccessDeniedError } from '../errors'
import { forbbiden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest, LoadAccountByToken, Middleware, HttpResponse } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = forbbiden(new AccessDeniedError())

      const headers = httpRequest.headers
      if (!headers) {
        return error
      }

      const accessToken = headers['x-access-token']
      if (!accessToken) {
        return error
      }

      const account = await this.loadAccountByToken.loadByToken(accessToken, this.role)
      if (!account) {
        return error
      }

      return ok({ accountID: account.id })
    } catch (err) {
      return serverError(err)
    }
  }
}
