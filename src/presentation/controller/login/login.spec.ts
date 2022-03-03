import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator/email-validator-adapter'

interface MakeTypes {
  loginController: LoginController
  emailValidator: EmailValidator
}

const makeLoginController = (): MakeTypes => {
  const emailValidator = makeEmailValidator()
  const loginController = new LoginController(emailValidator)
  return {
    loginController,
    emailValidator: emailValidator
  }
}

const makeEmailValidator = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'valid_email@test.com.br',
    password: 'valid_password'
  }
})

describe('LoginController', () => {
  test('Should return badrequest if email is no provided', async () => {
    const { loginController } = makeLoginController()

    const httpRequest = makeHttpRequest()

    delete httpRequest.body.email

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return badrequest if password is no provided', async () => {
    const { loginController } = makeLoginController()

    const httpRequest = makeHttpRequest()

    delete httpRequest.body.password

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Given password and email then should call EmailValidator with same body email', async () => {
    const { loginController, emailValidator } = makeLoginController()

    const emailSpyon = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = makeHttpRequest()

    await loginController.handle(httpRequest)

    expect(emailSpyon).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should call EmailValidator if email and password is provided', async () => {
    const { loginController, emailValidator } = makeLoginController()

    const emailSpyon = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = makeHttpRequest()

    await loginController.handle(httpRequest)

    expect(emailSpyon).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return badrequest if invalid email is provided', async () => {
    const { loginController, emailValidator } = makeLoginController()

    jest.spyOn(emailValidator, 'isValid').mockImplementation(() => false)

    const httpRequest = makeHttpRequest()

    httpRequest.body.email = 'invalid_email@.com.br'

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
