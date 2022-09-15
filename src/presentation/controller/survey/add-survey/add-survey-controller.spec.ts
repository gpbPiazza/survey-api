import { Validation, HttpRequest, badRequest, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

interface MakeTypes {
  sut: AddSurveyController
  validation: Validation
  addSurvey: AddSurvey
}

const makeAddSurveyController = (): MakeTypes => {
  const validation = makeValidation()
  const addSurvey = makeAddSurvey()
  const sut = new AddSurveyController(validation, addSurvey)
  return {
    sut,
    validation,
    addSurvey
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

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyTest implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new AddSurveyTest()
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

  test('should return 400 if validation fails', async () => {
    const { sut, validation } = makeAddSurveyController()
    jest.spyOn(validation, 'validate').mockReturnValueOnce(new Error())
    const fakeRequest = makeFakeHttpRequest()

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(badRequest(new Error()))
  })

  test('should call AddSurvey with correct values', async () => {
    const { sut, addSurvey } = makeAddSurveyController()
    const addSpy = jest.spyOn(addSurvey, 'add')
    const fakeRequest = makeFakeHttpRequest()

    await sut.handle(fakeRequest)

    expect(addSpy).toHaveBeenCalledWith(fakeRequest.body)
  })
})
