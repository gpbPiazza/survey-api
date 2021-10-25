import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const { body } = httpRequest
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!body[field]) { return badRequest(new MissingParamError(field)) }
      }

      const { password, passwordConfirmation, email, name } = body
      if (password !== passwordConfirmation) { return badRequest(new InvalidParamError('passwordConfirmation')) }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) { return badRequest(new InvalidParamError('email')) }

      const account = this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
