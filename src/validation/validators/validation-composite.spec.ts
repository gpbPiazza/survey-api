import { InvalidParamError, MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'
import { ValidationComposite } from './validation-composite'

interface MakeType {
  sut: ValidationComposite
  validations: Validation[]
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeSut = (): MakeType => {
  const validations = [makeValidationStub(), makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validations)
  return { sut, validations }
}

describe('Validation Composite', () => {
  test('should return error if any validations return error', () => {
    const { sut, validations } = makeSut()

    jest.spyOn(validations[2], 'validate').mockImplementationOnce(() => new MissingParamError('field'))

    const err = sut.validate({ field: 'any_value' })

    expect(err).toEqual(new MissingParamError('field'))
  })

  test('should not return error if all validations succeds', () => {
    const { sut } = makeSut()

    const err = sut.validate({ field: 'any_value' })

    expect(err).toBeFalsy()
  })

  test('should return the first error if more then one validation fails', () => {
    const { sut, validations } = makeSut()

    jest.spyOn(validations[2], 'validate').mockImplementationOnce(() => new MissingParamError('field'))
    jest.spyOn(validations[1], 'validate').mockImplementationOnce(() => new InvalidParamError('field'))

    const err = sut.validate({ field: 'any_value' })

    expect(err).toEqual(new InvalidParamError('field'))
  })
})
