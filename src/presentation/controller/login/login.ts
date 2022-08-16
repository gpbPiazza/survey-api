import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authenticator: Authentication

  constructor (emailValidator: EmailValidator, authenticator: Authentication) {
    this.emailValidator = emailValidator
    this.authenticator = authenticator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!body[field]) { return badRequest(new MissingParamError(field)) }
      }

      const { email, password } = body

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authenticator.auth(email, password)
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
