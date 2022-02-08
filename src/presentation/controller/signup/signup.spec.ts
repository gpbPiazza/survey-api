import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, Account } from './signup-protocols'
import { SignUpController } from './signup'

interface MakeTypes {
  singUpController: SignUpController
  emailValidator: EmailValidator
  addAccount: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorTest implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorTest()
}

const getExpectedBadRequestResponse = (error: Error): {name: string, message: string} => {
  const { name, message } = error
  return { name, message }
}

const makeAddAccount = (): AddAccount => {
  class AddAccountTest implements AddAccount {
    async add (account: AddAccountModel): Promise<Account> {
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

const makeSignUpController = (): MakeTypes => {
  const emailValidator = makeEmailValidator()
  const addAccount = makeAddAccount()

  const singUpController = new SignUpController(emailValidator, addAccount)

  return {
    singUpController,
    emailValidator,
    addAccount
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided ', async () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(getExpectedBadRequestResponse(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided ', async () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(getExpectedBadRequestResponse(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided ', async () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(getExpectedBadRequestResponse(new MissingParamError('password')))
  })

  test('Should return 400 if no passwordConfirmation is provided ', async () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(getExpectedBadRequestResponse(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if invalid email is provided ', async () => {
    const { singUpController, emailValidator } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email_invalid',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(getExpectedBadRequestResponse(new InvalidParamError('email')))
  })

  test('Should return 400 if password confirmation fails', async () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email_invalid',
        password: 'any_password',
        passwordConfirmation: 'any_password_invalid'
      }
    }
    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(getExpectedBadRequestResponse(new InvalidParamError('passwordConfirmation')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { singUpController, emailValidator } = makeSignUpController()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@test.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call EmailValidator with correct email', async () => {
    const { singUpController, emailValidator } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@valid.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    await singUpController.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@valid.com.br')
  })

  test('Should call CreateUser with correct values', async () => {
    const { singUpController, addAccount } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@valid.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const addAccountSpy = jest.spyOn(addAccount, 'add')

    await singUpController.handle(httpRequest)

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@valid.com.br',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { singUpController, addAccount } = makeSignUpController()

    jest.spyOn(addAccount, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@test.com.br',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if valid data is provided', async () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)

    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email'
    })
  })
})
