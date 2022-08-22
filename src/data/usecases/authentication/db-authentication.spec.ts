import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DBAuthentication } from './db-authentication'

describe('DBAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email ', async () => {
    const account: AccountModel = {
      id: 'any_id',
      name: 'any_Name',
      email: 'any_email@email.com',
      password: 'any_password'
    }

    class LoadAccountRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return await new Promise(resolve => resolve(account))
      }
    }

    const loadAccountRepositoryStub = new LoadAccountRepositoryStub()
    const sut = new DBAuthentication(loadAccountRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@email.com',
      password: '123'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})
