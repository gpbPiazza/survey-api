import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { EmailValidator } from '../protocols/email-validator'
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
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'invalid_email@mail.com'
      }
    }
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpResponse = singUpController.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
})
