import { Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUlr)
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
