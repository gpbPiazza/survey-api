import { DBLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository, SurveyModel, AnswerModel } from './db-load-surveys-protocols'

interface MakeTypes {
  sut: DBLoadSurveys
  loadSurveysRepository: LoadSurveysRepository
}

const makeDBLoadSurveys = (): MakeTypes => {
  const loadSurveysRepository = makeLoadSurveysRepository()
  const sut = new DBLoadSurveys(loadSurveysRepository)
  return {
    sut,
    loadSurveysRepository
  }
}

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysTest implements LoadSurveysRepository {
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

describe('DBLoadSurveys UseCase', () => {
  test('should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepository } = makeDBLoadSurveys()
    const repositorySpy = jest.spyOn(loadSurveysRepository, 'load')

    await sut.load()

    expect(repositorySpy).toHaveBeenCalledWith()
  })

  test('should throws if AddSurveyRepository throws', async () => {
    const { sut, loadSurveysRepository } = makeDBLoadSurveys()

    jest.spyOn(loadSurveysRepository, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.load()

    await expect(promise).rejects.toThrow()
  })

  test('should return a list off SurveysModel on success', async () => {
    const { sut } = makeDBLoadSurveys()

    const response = await sut.load()

    expect(response).toEqual(makeListOfSurveyModel())
  })
})
