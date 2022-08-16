import { LoginController } from './login'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { HttpRequest, EmailValidator, Authentication } from './login-protocols'

interface MakeTypes {
  loginController: LoginController
  emailValidator: EmailValidator
  authenticator: Authentication
}

const makeLoginController = (): MakeTypes => {
  const emailValidator = makeEmailValidator()
  const authenticator = makeAuthentication()
  const loginController = new LoginController(emailValidator, authenticator)
  return {
    loginController,
    emailValidator: emailValidator,
    authenticator
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
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

  test('Should return serverError if emailValidator trhows', async () => {
    const { loginController, emailValidator } = makeLoginController()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const httpRequest = makeHttpRequest()

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call authenticator with correct values', async () => {
    const { loginController, authenticator } = makeLoginController()

    const authSpy = jest.spyOn(authenticator, 'auth')

    const httpRequest = makeHttpRequest()

    await loginController.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { loginController, authenticator } = makeLoginController()

    jest.spyOn(authenticator, 'auth').mockImplementationOnce(async () => await new Promise(resolve => resolve('')))

    const httpRequest = makeHttpRequest()

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })
})
