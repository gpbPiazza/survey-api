
import { Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { AnswerModel } from '../../../../domain/models/answer'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultsCollection: Collection

const makeAnswerModel = (): AnswerModel => {
  return {
    id: 'any_answer_id',
    image: 'any_image',
    answer: 'any_answer'
  }
}
const makeSurveyModel = async (): Promise<string> => {
  const result = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [
      makeAnswerModel()
    ],
    date: makeDateOnly()
  })
  return result.insertedId.toString()
}
const makeAccountModel = async (): Promise<string> => {
  const result = await surveyCollection.insertOne({
    name: 'chuaum',
    email: 'any_email@gmail.com',
    passwrd: 'any_password'
  })

  return result.insertedId.toString()
}
function makeDateOnly (): Date {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}
const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Suvery Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUlr)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    accountCollection = MongoHelper.getCollection('accounts')
    surveyResultsCollection = MongoHelper.getCollection('surveyResults')
    const removeAll = {}
    await surveyCollection.deleteMany(removeAll)
    await accountCollection.deleteMany(removeAll)
    await surveyResultsCollection.deleteMany(removeAll)
  })

  describe('save()', () => {
    test('should add a survey result if its new', async () => {
      const surveyId = await makeSurveyModel()
      const accountId = await makeAccountModel()
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId: surveyId,
        answer: makeAnswerModel().answer,
        accountId: accountId,
        date: makeDateOnly()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(makeAnswerModel().answer)
    })
    test('should update a survey result if its not new', async () => {
      const surveyId = await makeSurveyModel()
      const accountId = await makeAccountModel()
      const surveyReult = await surveyResultsCollection.insertOne({
        surveyId: surveyId,
        answer: makeAnswerModel().answer,
        accountId: accountId,
        date: makeDateOnly()
      })
      const sut = makeSut()

      const surveyResult = await sut.save({
        surveyId: surveyId,
        answer: 'another_answer',
        accountId: accountId,
        date: makeDateOnly()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(surveyReult.insertedId.toString())
      expect(surveyResult.answer).toBe('another_answer')
    })
  })
})
