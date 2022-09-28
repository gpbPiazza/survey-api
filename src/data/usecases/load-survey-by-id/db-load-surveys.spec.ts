import { DBLoadSurveyById } from './db-load-survey-by-id'
import { AnswerModel, LoadSurveyByIdRepository, SurveyModel, LoadSurveyById } from './db-load-surveys-protocols'

type MakeTypes = {
  sut: LoadSurveyById
  loadSurveyByIdRepository: LoadSurveyByIdRepository
}

const makeDBLoadSurveyById = (): MakeTypes => {
  const loadSurveyByIdRepository = makeLoadSurveyByIdRepository()
  const sut = new DBLoadSurveyById(loadSurveyByIdRepository)
  return {
    sut,
    loadSurveyByIdRepository
  }
}

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyTest implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeSurveyModel()))
    }
  }
  return new LoadSurveyTest()
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
    date: makeDateOnly()
  }
}

function makeDateOnly (): Date {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

describe('DBLoadSurveyById UseCase', () => {
  test('should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepository } = makeDBLoadSurveyById()
    const repositorySpy = jest.spyOn(loadSurveyByIdRepository, 'loadById')
    const fakeID = 'salve_id'
    await sut.loadById(fakeID)

    expect(repositorySpy).toHaveBeenCalledWith(fakeID)
  })

  test('should throws if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepository } = makeDBLoadSurveyById()

    jest.spyOn(loadSurveyByIdRepository, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const fakeID = 'salve_id'

    const promise = sut.loadById(fakeID)

    await expect(promise).rejects.toThrow()
  })

  test('should return a SurveysModel on success', async () => {
    const { sut } = makeDBLoadSurveyById()

    const fakeID = 'salve_id'
    const response = await sut.loadById(fakeID)

    expect(response).toEqual(makeSurveyModel())
  })
})
