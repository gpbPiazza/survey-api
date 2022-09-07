import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'

interface MakeTypes {
  sut: EmailValidation
  emailValidator: EmailValidator
}
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeStu = (): MakeTypes => {
  const emailValidator = makeEmailValidator()
  const emailValidation = new EmailValidation('email', emailValidator)
  return {
    emailValidator,
    sut: emailValidation
  }
}

describe('Email Validation', () => {
  test('Should return InvalidParamError if invalid email is provided ', () => {
    const { sut, emailValidator } = makeStu()

    const email = 'any_email_invalid'

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const response = sut.validate({ email })

    expect(response).toEqual(new InvalidParamError('email'))
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidator } = makeStu()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(sut.validate).toThrow()
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeStu()

    const email = 'valid_email@test.com.br'

    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    sut.validate({ email })

    expect(isValidSpy).toHaveBeenCalledWith(email)
  })

  test('Should not return error if valid email is provided', async () => {
    const { sut, emailValidator } = makeStu()

    const email = 'valid_email@test.com.br'

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(true)

    const response = sut.validate({ email })

    expect(response).toBeFalsy()
  })
})
