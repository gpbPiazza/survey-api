import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    const removeAll = {}
    await accountCollection.deleteMany(removeAll)
  })
  describe('POST / signup ', () => {
    test('Should return an account on signup success', async () => {
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
})
