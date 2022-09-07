import { HttpRequest, HttpResponse, Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbbiden } from '../../helpers/http/http-helper'
import { EmailInUserError } from '../../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const { password, email, name } = body

      const err = this.validation.validate(body)
      if (err) {
        return badRequest(err)
      }

      const account = await this.addAccount.add({ name, email, password })

      if (!account) {
        return forbbiden(new EmailInUserError())
      }

      const accessToken = await this.authentication.auth({ email, password })

      return ok({ accessToken })
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
