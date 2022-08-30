import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-protocols-controller'

export class LoginController implements Controller {
  constructor (private readonly validation: Validation, private readonly authenticator: Authentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const err = this.validation.validate(body)
      if (err) {
        return badRequest(err)
      }
      const { email, password } = body
      const accessToken = await this.authenticator.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
