import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './signup-controller-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

export class SignUpController implements Controller {
  constructor (private readonly addAccount: AddAccount, private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const err = this.validation.validate(body)
      if (err) {
        return badRequest(err)
      }

      const { password, email, name } = body

      const account = await this.addAccount.add({ name, email, password })

      return ok({ name: account.name, email: account.email, id: account.id })
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
