import { LoginController } from './login-controller'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helper'
import { MissingParamError } from '../../errors'
import { HttpRequest, Authentication, Validation, AuthenticationModel } from './login-protocols-controller'

interface MakeTypes {
  loginController: LoginController
  authenticator: Authentication
  validation: Validation
}

const makeLoginController = (): MakeTypes => {
  const authenticator = makeAuthentication()
  const validation = makeValidation()
  const loginController = new LoginController(validation, authenticator)
  return {
    loginController,
    authenticator,
    validation
  }
}

const makeValidation = (): Validation => {
  class ValidationTest implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationTest()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (model: AuthenticationModel): Promise<string> {
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
  test('Should call authenticator with correct values', async () => {
    const { loginController, authenticator } = makeLoginController()

    const authSpy = jest.spyOn(authenticator, 'auth')

    const httpRequest = makeHttpRequest()

    await loginController.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({ email: httpRequest.body.email, password: httpRequest.body.password })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { loginController, authenticator } = makeLoginController()

    jest.spyOn(authenticator, 'auth').mockImplementationOnce(async () => await new Promise(resolve => resolve('')))

    const httpRequest = makeHttpRequest()

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return serverError if authentication trhows', async () => {
    const { loginController, authenticator } = makeLoginController()

    jest.spyOn(authenticator, 'auth').mockImplementationOnce(async () =>
      await new Promise((resolve, reject) => reject(new Error())))

    const httpRequest = makeHttpRequest()

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { loginController } = makeLoginController()

    const httpRequest = makeHttpRequest()

    const httpResponse = await loginController.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct value', async () => {
    const { loginController, validation } = makeLoginController()

    const httpRequest = makeHttpRequest()

    const validationSpy = jest.spyOn(validation, 'validate')

    await loginController.handle(httpRequest)

    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns error', async () => {
    const { loginController, validation } = makeLoginController()

    const httpRequest = makeHttpRequest()

    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const response = await loginController.handle(httpRequest)

    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
