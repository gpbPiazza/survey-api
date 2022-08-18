import e from 'express'
import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface MakeType {
  sut: ValidationComposite
  validation: Validation
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
  const validation = makeValidationStub()
  const sut = new ValidationComposite([validation])
  return { sut, validation }
}

describe('Validation Composite', () => {
  test('should return error if any validations return error', () => {
    const { sut, validation } = makeSut()

    jest.spyOn(validation, 'validate').mockImplementationOnce(() => new MissingParamError('field'))

    const err = sut.validate({ field: 'any_value' })

    expect(err).toEqual(new MissingParamError('field'))
  })

  test('should not return error if all validations succeds', () => {
    const { sut } = makeSut()

    const err = sut.validate({ field: 'any_value' })

    expect(err).toBeFalsy()
  })
})
