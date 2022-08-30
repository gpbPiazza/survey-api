import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeEmailValidatorAdapter = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adaoter', () => {
  test('Should return false if validator returns false', () => {
    const emailValidator = makeEmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = emailValidator.isValid('invalid_email_gmail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const emailValidator = makeEmailValidatorAdapter()

    const isValid = emailValidator.isValid('valid_email_@gmail.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator if correct email', () => {
    const emailValidator = makeEmailValidatorAdapter()
    const anyEmail = 'any_email_@gmail.com'
    const validatorSpy = jest.spyOn(validator, 'isEmail')

    emailValidator.isValid(anyEmail)

    expect(validatorSpy).toHaveBeenCalledWith(anyEmail)
  })
})
