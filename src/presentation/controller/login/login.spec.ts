import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols'

const makeLoginController = (): LoginController => {
  return new LoginController()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'valid_email@test.com.br',
    password: 'valid_password'
  }
})

describe('LoginController', () => {
  test('Should return badrequest if email is no provided', async () => {
    const loginController = makeLoginController()

    const httpRequest = makeHttpRequest()

    delete httpRequest.body.email

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return badrequest if password is no provided', async () => {
    const loginController = makeLoginController()

    const httpRequest = makeHttpRequest()

    delete httpRequest.body.password

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
