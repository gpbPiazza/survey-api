import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols'
import { SignUpController } from './signup'

interface MakeTypes {
  singUpController: SignUpController
  emailValidator: EmailValidator
}

const makeSignUpController = (): MakeTypes => {
  class EmailValidatorTest implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidator = new EmailValidatorTest()
  const singUpController = new SignUpController(emailValidator)
  return {
    singUpController,
    emailValidator
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

  test('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorTest implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidator = new EmailValidatorTest()

    const singUpController = new SignUpController(emailValidator)

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
})
