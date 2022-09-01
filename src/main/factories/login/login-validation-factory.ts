import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidation } from '../../../presentation/validators/email-validation'
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter'
import { RequiredFieldValidation, ValidationComposite } from '../../../presentation/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
