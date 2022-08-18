import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare Fields Validation', () => {
  test('should return InvalidParamError if the fields are not equal', () => {
    const password = '123'

    const passwordConfirmation = '456'

    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')

    const response = sut.validate({ password, passwordConfirmation })

    expect(response).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return undefined if all required field is provided', () => {
    const password = '123'

    const passwordConfirmation = '123'

    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')

    const response = sut.validate({ password, passwordConfirmation })

    expect(response).toBeUndefined()
  })
})
