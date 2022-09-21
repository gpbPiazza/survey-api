import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel, HttpRequest, AnswerModel } from './load-surveys-controller-protocols'
import { serverError, ok } from '../../../helpers/http/http-helper'
import { ServerError } from '../../../errors/index'

interface MakeTypes {
  sut: LoadSurveysController
  loadSurveys: LoadSurveys
}

const makeLoadSurveysController = (): MakeTypes => {
  const loadSurveys = makeLoadSurveys()
  const sut = new LoadSurveysController(loadSurveys)
  return {
    sut,
    loadSurveys
  }
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysTest implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return await new Promise(resolve => resolve(makeListOfSurveyModel()))
    }
  }
  return new LoadSurveysTest()
}

const makeAnswerModel = (): AnswerModel => {
  return {
    id: 'any_id',
    image: 'any_image',
    answer: 'any_answer'
  }
}
const makeSurveyModel = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [
      makeAnswerModel()
    ],
    date: new Date()
  }
}
const makeListOfSurveyModel = (): SurveyModel[] => {
  const result: SurveyModel[] = []
  result.push(makeSurveyModel())
  result.push(makeSurveyModel())
  result.push(makeSurveyModel())
  return result
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {},
  headers: {}
})

describe('Load Surveys Controller', () => {
  test('should call LoadSurveys with correct values', async () => {
    const { sut, loadSurveys } = makeLoadSurveysController()
    const loadSpy = jest.spyOn(loadSurveys, 'load')
    const fakeRequest = makeFakeHttpRequest()

    await sut.handle(fakeRequest)

    expect(loadSpy).toHaveBeenCalledWith()
  })

  test('should return 500 when LoadSurveys throws', async () => {
    const { sut, loadSurveys } = makeLoadSurveysController()
    jest.spyOn(loadSurveys, 'load').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const fakeRequest = makeFakeHttpRequest()

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new ServerError()))
  })

  test('should return 200 on success', async () => {
    const { sut } = makeLoadSurveysController()

    const fakeRequest = makeFakeHttpRequest()

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(ok(makeListOfSurveyModel()))
  })
})
