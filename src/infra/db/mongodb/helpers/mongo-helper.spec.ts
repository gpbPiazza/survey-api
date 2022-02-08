import { MongoHelper as mongoHelper } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
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
