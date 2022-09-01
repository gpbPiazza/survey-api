import { InvalidParamError } from '../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Compare Fields Validation', () => {
  test('should return InvalidParamError if the fields are not equal', () => {
    const field = '123'

    const fieldToCompare = '2342343'

    const sut = makeSut()

    const response = sut.validate({ field, fieldToCompare })

    expect(response).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('should not return error if validation succeds', () => {
    const field = '123'

    const fieldToCompare = '123'

    const sut = makeSut()

    const response = sut.validate({ field, fieldToCompare })

    expect(response).toBeFalsy()
  })
})
