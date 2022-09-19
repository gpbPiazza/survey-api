import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../../config/app'
import env from '../../config/env'
import { MongoHelper } from '../../../infra/repositories/no-sql/helpers/mongo-helper'

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUlr)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    const removeAll = {}
    await accountCollection.deleteMany(removeAll)
  })
  describe('POST /signup ', () => {
    test('should return http status 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Teste',
          email: 'teste.integration@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login ', () => {
    test('should return http status 200 on login', async () => {
      const password = await hash('valid_password', 12)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@gmail.com',
          password: 'valid_password'
        })
        .expect(200)
    })

    test('should return http status 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@gmail.com',
          password: 'valid_password'
        })
        .expect(401)
    })
  })
})
