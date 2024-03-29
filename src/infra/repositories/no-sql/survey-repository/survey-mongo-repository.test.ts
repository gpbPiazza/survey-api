
import { Collection, ObjectId } from 'mongodb'
import { AddSurveyParam } from '../../../../domain/usecases/survey/add-survey'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection
const makeFakeAddSurveyModel = (): AddSurveyParam => {
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
const makeAnswerModelWithoutID = (): any => {
  return {
    image: 'any_image',
    answer: 'any_answer'
  }
}

const makeSurveyModelWithoutID = (): any => {
  return {
    question: 'any_question',
    answers: [
      makeAnswerModelWithoutID()
    ],
    date: makeDateOnly()
  }
}

function makeDateOnly (): Date {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
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

  describe('AddSurveyRepository', () => {
    test('should return void on add success ', async () => {
      const sut = makeSurveyMongoRepository()

      const voidResponse = await sut.add(makeFakeAddSurveyModel())

      expect(voidResponse).toBeFalsy()

      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('LoadSurveysRepository', () => {
    test('should load all Surveys Models on success ', async () => {
      await surveyCollection.insertMany([makeSurveyModelWithoutID(), makeSurveyModelWithoutID()])
      const sut = makeSurveyMongoRepository()

      const response = await sut.loadAll()

      expect(response).toBeTruthy()
      expect(response.length).toBe(2)
      expect(response[0].question).toBe('any_question')
      expect(response[1].question).toBe('any_question')
    })

    test('should return empty array when has no Surveys on db', async () => {
      const sut = makeSurveyMongoRepository()

      const response = await sut.loadAll()

      expect(response).toBeTruthy()
      expect(response.length).toBe(0)
    })
  })

  describe('LoadSurveyByIdRepository', () => {
    test('should return a SurveyModel on success', async () => {
      const result = await surveyCollection.insertMany([makeSurveyModelWithoutID(), makeSurveyModelWithoutID()])
      const sut = makeSurveyMongoRepository()

      const firstID = result.insertedIds[0]
      const response = await sut.loadById(firstID.toString())

      expect(response).toBeTruthy()
      expect(response.id).toBe(firstID.toString())
    })

    test('should return a null when lodById not find anything', async () => {
      const sut = makeSurveyMongoRepository()

      const fakeId = new ObjectId()
      const response = await sut.loadById(fakeId.toString())

      expect(response).toBeFalsy()
    })
  })
})
