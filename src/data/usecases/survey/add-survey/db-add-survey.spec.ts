import { AddSurvey, AddSurveyParam, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

type MakeTypes = {
  addSuveryRepository: AddSurveyRepository
  sut: AddSurvey
}

const makeDbAddSurvey = (): MakeTypes => {
  const addSuveryRepository = makeAddSuveryRepository()
  const sut = new DbAddSurvey(addSuveryRepository)
  return {
    sut,
    addSuveryRepository
  }
}

const makeAddSuveryRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryTest implements AddSurveyRepository {
    async add (input: AddSurveyParam): Promise<void> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new AddSurveyRepositoryTest()
}
const makeFakeAddSurveyModel = (): AddSurveyParam => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}
describe('DbAddSurvey UseCase', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSuveryRepository } = makeDbAddSurvey()
    const repositorySpy = jest.spyOn(addSuveryRepository, 'add')
    const input = makeFakeAddSurveyModel()

    await sut.add(input)

    expect(repositorySpy).toHaveBeenCalledWith(input)
  })

  test('should throws if AddSurveyRepository throws', async () => {
    const { sut, addSuveryRepository } = makeDbAddSurvey()

    jest.spyOn(addSuveryRepository, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const input = makeFakeAddSurveyModel()

    const promise = sut.add(input)

    await expect(promise).rejects.toThrow()
  })

  test('should return void on success', async () => {
    const { sut } = makeDbAddSurvey()
    const input = makeFakeAddSurveyModel()

    const response = await sut.add(input)

    expect(response).toBeFalsy()
  })
})
