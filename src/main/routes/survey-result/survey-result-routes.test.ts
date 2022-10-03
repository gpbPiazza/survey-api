import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../../config/app'
import env from '../../config/env'
import { MongoHelper } from '../../../infra/repositories/no-sql/helpers/mongo-helper'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection
const insetUserInDataBase = async (): Promise<{accessToken: string, accountId: string}> => {
  const password = await hash('valid_password', 12)
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password
  })
  const userID = res.insertedId
  const accessToken = sign({ id: userID }, env.jwtSecrect)
  await accountCollection.updateOne({
    _id: userID
  }, {
    $set: {
      accessToken
    }
  })
  return { accessToken, accountId: res.insertedId.toString() }
}
const makeSaveSurveyResultBody = (): any => {
  return {
    answerId: 'asd',
    date: makeDateOnly()
  }
}
function makeDateOnly (): Date {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUlr)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    accountCollection = MongoHelper.getCollection('accounts')

    const removeAll = {}
    await surveyCollection.deleteMany(removeAll)
    await accountCollection.deleteMany(removeAll)
  })
  describe('PUT /surveys/:surveyId/results ', () => {
    test('should return 200 on save survey result with valid accessToken', async () => {
      const { accessToken } = await insetUserInDataBase()
      const survey = await surveyCollection.insertOne({
        question: 'salve salve, bom dia ou boa noite?',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            image: 'any_image_2',
            answer: 'any_answer_2'
          }
        ],
        date: makeDateOnly()
      })
      await request(app)
        .put(`/api/surveys/${survey.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer',
          date: makeDateOnly()
        })
        .expect(200)
    })
    test('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_surveyId/results')
        .send({ ...makeSaveSurveyResultBody() })
        .expect(403)
    })
  })
})
