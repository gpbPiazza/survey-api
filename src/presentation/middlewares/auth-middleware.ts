import { AccessDeniedError } from '../errors'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'
import { forbbiden, ok, serverError } from '../helpers/http/http-helper'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = forbbiden(new AccessDeniedError())
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) {
        return error
      }

      const account = await this.loadAccountByToken.load(accessToken)
      if (!account) {
        return error
      }

      return ok({ accountID: account.id })
    } catch (err) {
      return serverError(err)
    }
  }
}
