import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeAccountMongoRepository = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('should return an account on success ', async () => {
    const accountMongoRepository = makeAccountMongoRepository()

    const account = await accountMongoRepository.add({
      name: 'any_name',
      email: 'valid_email@teste.com.br',
      password: 'valid_password'
    })

    expect(account).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('valid_email@teste.com.br')
    expect(account.password).toBe('valid_password')
    expect(account.id).toBeTruthy()
  })
})
