import { SaveSurveyResultController } from './save-survey-result-controller'
import { LoadSurveyById, SurveyModel, AnswerModel, HttpRequest, SaveSurveyResult } from './save-survey-result-controller-protocols'
import { InvalidParamError } from '../../../errors'
import { badRequest, forbbiden, serverError, ok } from '../../../helpers/http/http-helper'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { AddSurveyResultModel } from '../../../../domain/usecases/survey-result/save-survey-result'

type MakeTypes = {
  sut: SaveSurveyResultController
  loadSurveyById: LoadSurveyById
  saveSurveyResult: SaveSurveyResult
}

const makeSaveSurveyResultController = (): MakeTypes => {
  const loadSurveyById = makeLoadSurveyById()
  const saveSurveyResult = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyById, saveSurveyResult)
  return {
    sut,
    loadSurveyById,
    saveSurveyResult
  }
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SurveyResultTest implements SaveSurveyResult {
    async save (data: AddSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve(makeSurveyResultModel()))
    }
  }
  return new SurveyResultTest()
}
const makeSurveyResultModel = (): SurveyResultModel => {
  return {
    id: 'any_sruvey_result_id',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'string',
    date: makeDateOnly()
  }
}
const makeLoadSurveyById = (): LoadSurveyById => {
  class SurveyTest implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeSurveyModel()))
    }
  }
  return new SurveyTest()
}
const makeAnswerModel = (): AnswerModel => {
  return {
    id: 'any_answer_id',
    image: 'any_image',
    answer: 'any_answer'
  }
}
const makeSurveyModel = (): SurveyModel => {
  return {
    id: 'any_survey_id',
    question: 'any_question',
    answers: [
      makeAnswerModel()
    ],
    date: makeDateOnly()
  }
}
function makeDateOnly (): Date {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}
const makeFakeHttpRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answerId: 'any_answer_id',
    date: makeDateOnly()
  },
  accountId: 'any_account_id'
})
const makeAddSurveyResultModel = (): AddSurveyResultModel => {
  return {
    surveyId: makeSurveyModel().id,
    // answerId: makeFakeHttpRequest().body.answerId,
    answer: '',
    accountId: makeFakeHttpRequest().accountId,
    date: makeDateOnly()
  }
}

describe('Save Survey Result Controller', () => {
  test('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyById } = makeSaveSurveyResultController()

    const loadSpy = jest.spyOn(loadSurveyById, 'loadById')

    const fakeRequest = makeFakeHttpRequest()

    await sut.handle(fakeRequest)

    expect(loadSpy).toHaveBeenLastCalledWith(fakeRequest.params.surveyId)
  })

  test('should return 403 if LoadSurveyById not found a survey', async () => {
    const { sut, loadSurveyById } = makeSaveSurveyResultController()

    jest.spyOn(loadSurveyById, 'loadById').mockReturnValueOnce(null)

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(forbbiden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyById } = makeSaveSurveyResultController()

    jest.spyOn(loadSurveyById, 'loadById').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 400 if body not contains a valid answerId', async () => {
    const { sut } = makeSaveSurveyResultController()

    const httpRequest = makeFakeHttpRequest()

    httpRequest.body.answerId = 'not_valid_id'

    const response = await sut.handle(httpRequest)

    expect(response).toEqual(badRequest(new InvalidParamError('answerId')))
  })

  test('should call SaveSurveyResult with correct value', async () => {
    const { sut, saveSurveyResult } = makeSaveSurveyResultController()

    const saveSpy = jest.spyOn(saveSurveyResult, 'save')

    const fakeRequest = makeFakeHttpRequest()

    await sut.handle(fakeRequest)

    expect(saveSpy).toHaveBeenLastCalledWith(makeAddSurveyResultModel())
  })

  test('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResult } = makeSaveSurveyResultController()

    jest.spyOn(saveSurveyResult, 'save').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const response = await sut.handle(makeFakeHttpRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('should return SurveyResult on success', async () => {
    const { sut } = makeSaveSurveyResultController()

    const fakeRequest = makeFakeHttpRequest()

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(ok(makeSurveyResultModel()))
  })
})
