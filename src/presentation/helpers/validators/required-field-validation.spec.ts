import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('should return MissingParamError if a the field is not provided', () => {
    const name = 'test name'

    const requiredFieldName = 'email'

    const sut = new RequiredFieldValidation(requiredFieldName)

    const response = sut.validate({ name })

    expect(response).toEqual(new MissingParamError(requiredFieldName))
  })

  test('should return undefined if all required field is provided', () => {
    const name = 'test name'

    const requiredFieldName = 'name'

    const sut = new RequiredFieldValidation(requiredFieldName)

    const response = sut.validate({ name })

    expect(response).toBeUndefined()
  })
})
