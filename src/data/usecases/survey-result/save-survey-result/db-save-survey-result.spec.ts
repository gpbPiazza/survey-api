import { DBSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, SurveyResultModel, AddSurveyResultModel } from './db-save-survey-result-protocols'

type MakeTypes = {
  saveSurveyResultRepository: SaveSurveyResultRepository
  sut: DBSaveSurveyResult
}

const makeDBSaveSurveyResult = (): MakeTypes => {
  const saveSurveyResultRepository = makeSaveSurveyResultRepository()
  const sut = new DBSaveSurveyResult(saveSurveyResultRepository)
  return {
    sut,
    saveSurveyResultRepository
  }
}

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryTest implements SaveSurveyResultRepository {
    async save (input: AddSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise(resolve => resolve(makeFakeSurveyResultModel()))
    }
  }
  return new SaveSurveyResultRepositoryTest()
}
const makeFakeAddSurveyResultModel = (): AddSurveyResultModel => {
  const { surveyId, accountId, answer, date } = makeFakeSurveyResultModel()
  return { surveyId, accountId, answer, date }
}

const makeFakeSurveyResultModel = (): SurveyResultModel => {
  return {
    id: 'any_id',
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'string',
    date: makeDateOnly()
  }
}

function makeDateOnly (): Date {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

describe('DBSaveSurveyResylt UseCase', () => {
  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepository } = makeDBSaveSurveyResult()

    const repositorySpy = jest.spyOn(saveSurveyResultRepository, 'save')

    const input = makeFakeAddSurveyResultModel()
    await sut.save(input)

    expect(repositorySpy).toHaveBeenCalledWith(input)
  })

  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepository } = makeDBSaveSurveyResult()

    jest.spyOn(saveSurveyResultRepository, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const input = makeFakeAddSurveyResultModel()
    const promise = sut.save(input)

    await expect(promise).rejects.toThrow()
  })

  test('should return a SurveyResultModel on success', async () => {
    const { sut } = makeDBSaveSurveyResult()

    const input = makeFakeAddSurveyResultModel()
    const response = await sut.save(input)

    expect(response).toEqual(makeFakeSurveyResultModel())
  })
})
