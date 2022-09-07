import { makeSignupValidation } from './signup-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { RequiredFieldValidation, ValidationComposite, CompareFieldsValidation } from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()

    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
