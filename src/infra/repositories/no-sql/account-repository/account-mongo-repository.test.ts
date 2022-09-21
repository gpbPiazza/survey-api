import { Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUlr)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeAccountMongoRepository = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    const removeAll = {}
    await accountCollection.deleteMany(removeAll)
  })
  describe('add()', () => {
    test('should return an account on add success ', async () => {
      const sut = makeAccountMongoRepository()

      const account = await sut.add({
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
  describe('loadByEmail()', () => {
    test('should return an account on loadByEmail success ', async () => {
      const sut = makeAccountMongoRepository()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'valid_password'
      })

      const account = await sut.loadByEmail('any_email@gmail.com')

      expect(account).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('valid_password')
      expect(account.id).toBeTruthy()
    })

    test('should return null when loadByEmail when not find a user', async () => {
      const sut = makeAccountMongoRepository()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'valid_password'
      })

      const account = await sut.loadByEmail('a_email_not_in_the_db@gmail.com')

      expect(account).toBeFalsy()
    })
  })
  describe('updateAccessToken()', () => {
    test('should update the account accessToken on updateAccesToken with sucess', async () => {
      const sut = makeAccountMongoRepository()

      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'valid_password'
      })

      await sut.updateAccessToken(res.insertedId.toString(), 'any_token')

      const account = await accountCollection.findOne({ _id: res.insertedId })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })
  describe('loadByToken()', () => {
    test('should return an account on loadByToken success ', async () => {
      const sut = makeAccountMongoRepository()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'valid_password',
        token: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('valid_password')
      expect(account.id).toBeTruthy()
    })

    test('should return null loadByToken when user dont have role', async () => {
      const sut = makeAccountMongoRepository()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'valid_password',
        token: 'any_token'
      })

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeFalsy()
    })

    test('should return an account loadByToken when user is admin and we not passed role', async () => {
      const sut = makeAccountMongoRepository()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'valid_password',
        token: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('valid_password')
      expect(account.id).toBeTruthy()
    })

    test('should return null when loadByEmail when not find a user', async () => {
      const sut = makeAccountMongoRepository()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'valid_password',
        token: 'any_token'
      })

      const account = await sut.loadByToken('no_existing_token')

      expect(account).toBeFalsy()
    })

    test('should return an account on loadByToken with role optional', async () => {
      const sut = makeAccountMongoRepository()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'valid_password',
        token: 'any_token'
      })

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
      expect(account.password).toBe('valid_password')
      expect(account.id).toBeTruthy()
    })
  })
})
