import { EmailInUserError, MissingParamError, ServerError } from '../../errors'
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  Validation,
  Authentication,
  AuthenticationModel
} from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { ok, serverError, badRequest, forbbiden } from '../../helpers/http/http-helper'

type MakeTypes = {
  singUpController: SignUpController
  addAccount: AddAccount
  validation: Validation
  authentication: Authentication
}

const makeAddAccount = (): AddAccount => {
  class AddAccountTest implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountTest()
}

const makeValidation = (): Validation => {
  class ValidationTest implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationTest()
}

const makeSignUpController = (): MakeTypes => {
  const addAccount = makeAddAccount()
  const validation = makeValidation()
  const authentication = makeAuthentication()

  const singUpController = new SignUpController(addAccount, validation, authentication)

  return {
    singUpController,
    addAccount,
    validation,
    authentication
  }
}

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'valid_name',
    email: 'valid_email@test.com.br',
    password: 'valid_password',
    passwordConfirmation: 'valid_password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (model: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

describe('SignUp Controller', () => {
  test('Should call CreateUser with correct values', async () => {
    const { singUpController, addAccount } = makeSignUpController()

    const httpRequest = makeHttpRequest()

    const addAccountSpy = jest.spyOn(addAccount, 'add')

    await singUpController.handle(httpRequest)

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@test.com.br',
      password: 'valid_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { singUpController, addAccount } = makeSignUpController()

    jest.spyOn(addAccount, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = makeHttpRequest()

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = makeHttpRequest()

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct value', async () => {
    const { singUpController, validation } = makeSignUpController()

    const httpRequest = makeHttpRequest()

    const validationSpy = jest.spyOn(validation, 'validate')

    await singUpController.handle(httpRequest)

    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns error', async () => {
    const { singUpController, validation } = makeSignUpController()

    const httpRequest = makeHttpRequest()

    jest.spyOn(validation, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const response = await singUpController.handle(httpRequest)

    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call authenticator with correct values', async () => {
    const { singUpController, authentication } = makeSignUpController()

    const authSpy = jest.spyOn(authentication, 'auth')

    const httpRequest = makeHttpRequest()

    await singUpController.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith({ email: httpRequest.body.email, password: httpRequest.body.password })
  })
  test('Should return serverError if authentication trhows', async () => {
    const { singUpController, authentication } = makeSignUpController()

    jest.spyOn(authentication, 'auth').mockImplementationOnce(async () =>
      await new Promise((resolve, reject) => reject(new Error())))

    const httpRequest = makeHttpRequest()

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if addAccount returns null', async () => {
    const { singUpController, addAccount } = makeSignUpController()

    jest.spyOn(addAccount, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const httpRequest = makeHttpRequest()

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse).toEqual(forbbiden(new EmailInUserError()))
  })
})
