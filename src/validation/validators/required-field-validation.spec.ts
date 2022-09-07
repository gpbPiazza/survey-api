import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('Required Field Validation', () => {
  test('should return MissingParamError if a the field is not provided', () => {
    const name = 'test name'

    const sut = makeSut()

    const response = sut.validate({ name })

    expect(response).toEqual(new MissingParamError('field'))
  })

  test('should not return error if validation succeds', () => {
    const field = 'test name'

    const sut = makeSut()

    const response = sut.validate({ field })

    expect(response).toBeFalsy()
  })
})
