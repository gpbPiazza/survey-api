import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../../config/app'
import env from '../../config/env'
import { MongoHelper } from '../../../infra/repositories/no-sql/helpers/mongo-helper'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

let surveyCollection: Collection
let accountCollection: Collection
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
  describe('POST /survey ', () => {
    test('should return 403 on create survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }]
        })
        .expect(403)
    })
    test('should return 403 when x-access-token is invalid', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', 'any_invalid_token')
        .send({
          question: 'any_question',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }]
        })
        .expect(403)
    })
    test('should return 204 on create survey with valid accessToken', async () => {
      const password = await hash('valid_password', 12)
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password,
        role: 'admin'
      })
      const userID = res.insertedId
      const accessToken = sign({ id: userID }, env.jwtSecrect)
      await accountCollection.updateOne({
        _id: userID
      }, {
        $set: {
          token: accessToken
        }
      })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }]
        })
        .expect(204)
    })
  })
})
