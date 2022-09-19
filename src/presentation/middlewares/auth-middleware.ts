import { AccessDeniedError } from '../errors'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'
import { forbbiden, ok } from '../helpers/http/http-helper'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
  }
}
