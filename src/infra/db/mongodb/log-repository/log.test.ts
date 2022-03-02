import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    const removeAll = {}
    await errorCollection.deleteMany(removeAll)
  })

  test('Should create an error on success', async () => {
    const logMongoRepository = new LogMongoRepository()

    await logMongoRepository.logError('any error')

    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
