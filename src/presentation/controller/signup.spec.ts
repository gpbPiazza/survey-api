import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { Account } from '../../domain/usecases/models/account'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
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

const makeAddAccount = (): AddAccount => {
  class AddAccountTest implements AddAccount {
    add (account: AddAccountModel): Account {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return fakeAccount
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
  test('Should return 400 if no name is provided ', () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided ', () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided ', () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided ', () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }

    const httpResponse = singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if invalid email is provided ', () => {
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

    const httpResponse = singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 400 if password confirmation fails', () => {
    const { singUpController } = makeSignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email_invalid',
        password: 'any_password',
        passwordConfirmation: 'any_password_invalid'
      }
    }
    const httpResponse = singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 500 if EmailValidator throws', () => {
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

    const httpResponse = singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call EmailValidator with correct email', () => {
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

    singUpController.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@valid.com.br')
  })

  test('Should call CreateUser with correct values', () => {
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

    singUpController.handle(httpRequest)

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@valid.com.br',
      password: 'any_password'
    })
  })
})
