import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adaoter', () => {
  test('Should return false if validator returns false', () => {
    const emailValidator = new EmailValidatorAdapter()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = emailValidator.isValid('invalid_email_gmail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const emailValidator = new EmailValidatorAdapter()

    const isValid = emailValidator.isValid('valid_email_@gmail.com')
    expect(isValid).toBe(true)
  })
})
