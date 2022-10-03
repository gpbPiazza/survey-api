import { AccessDeniedError } from '../errors'
import { badRequest, forbbiden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest, LoadAccountByToken, Middleware, HttpResponse } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const forbiddenError = forbbiden(new AccessDeniedError())

      const headers = httpRequest.headers
      if (!headers) {
        return badRequest({ message: 'no headers were provided', name: 'NoHeaders' })
      }

      const accessToken = headers['x-access-token']
      if (!accessToken) {
        return forbiddenError
      }

      const account = await this.loadAccountByToken.loadByToken(accessToken, this.role)
      if (!account) {
        return forbiddenError
      }
      return ok({ accountId: account.id.toString() })
    } catch (err) {
      return serverError(err)
    }
  }
}
