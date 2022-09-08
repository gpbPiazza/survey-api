import { MongoHelper as mongoHelper } from './mongo-helper'
import env from '../../../../main/config/env'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await mongoHelper.connect(env.mongoUlr)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  test('should reconnect if mongodb client is down', async () => {
    let accountCollection = mongoHelper.getCollection('accounts')
    expect(accountCollection).toBeTruthy()

    await mongoHelper.disconnect()

    accountCollection = mongoHelper.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
