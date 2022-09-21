
import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection
const makeFakeAddSurveyModel = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      answer: 'another_answer'
    }],
    date: new Date()
  }
}
describe('Suvery Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUlr)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSurveyMongoRepository = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    const removeAll = {}
    await surveyCollection.deleteMany(removeAll)
  })

  test('should return void on add success ', async () => {
    const sut = makeSurveyMongoRepository()

    const voidResponse = await sut.add(makeFakeAddSurveyModel())

    expect(voidResponse).toBeFalsy()

    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
