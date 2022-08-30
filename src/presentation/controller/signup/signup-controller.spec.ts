import { MissingParamError, ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, Validation } from './signup-protocols-controller'
import { SignUpController } from './signup-controller'
import { ok, serverError, badRequest } from '../../helpers/http/http-helper'

interface MakeTypes {
  singUpController: SignUpController
  addAccount: AddAccount
  validation: Validation
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

  const singUpController = new SignUpController(addAccount, validation)

  return {
    singUpController,
    addAccount,
    validation
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

    expect(httpResponse).toEqual(ok({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email'
    }))
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
})
