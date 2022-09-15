import { Validation, HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

interface MakeTypes {
  sut: AddSurveyController
  validation: Validation
}

const makeAddSurveyController = (): MakeTypes => {
  const validation = makeValidation()
  const sut = new AddSurveyController(validation)
  return {
    sut,
    validation
  }
}

const makeValidation = (): Validation => {
  class ValidationTest implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationTest()
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

describe('Add Survey Controller', () => {
  test('should call validation with correct values', async () => {
    const { sut, validation } = makeAddSurveyController()
    const validateSpy = jest.spyOn(validation, 'validate')
    const fakeRequest = makeFakeHttpRequest()

    await sut.handle(fakeRequest)

    expect(validateSpy).toHaveBeenCalledWith(fakeRequest.body)
  })
})
