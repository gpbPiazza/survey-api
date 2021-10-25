import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adaoter', () => {
  test('Should return false if validator returns false', () => {
    const emailValidator = new EmailValidatorAdapter()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const isValid = emailValidator.isValid('invalid_email_@gmail.com')
    expect(isValid).toBe(false)
  })
})
