
import { DBLoudAccountByToken } from './add-load-account-by-token'
import { AccountModel } from '../../../../domain/models/account'
import { Decrypter } from '../../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../../protocols/db/account/load-account-by-token-repository'

type MakeTypes = {
  sut: DBLoudAccountByToken
  decrypter: Decrypter
  accountRepository: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => {
  const account: AccountModel = {
    id: 'any_id',
    name: 'any_Name',
    email: 'any_email@email.com',
    password: 'hashed_password'
  }
  return account
}

const makeDecrypter = (): Decrypter => {
  class DecrypterTest implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new DecrypterTest()
}

const makeAccountRepository = (): LoadAccountByTokenRepository => {
  class AccountRepositoryTest implements LoadAccountByTokenRepository {
    async loadByToken (token: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AccountRepositoryTest()
}

const makeDBLoudAccountByToken = (): MakeTypes => {
  const decrypter = makeDecrypter()
  const accountRepository = makeAccountRepository()
  const sut = new DBLoudAccountByToken(decrypter, accountRepository)
  return {
    sut,
    decrypter,
    accountRepository
  }
}

describe('DBLoudAccountByToken', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decrypter } = makeDBLoudAccountByToken()
    const decrypterSpy = jest.spyOn(decrypter, 'decrypt')
    await sut.loadByToken('accessToken', 'anyRole')
    expect(decrypterSpy).toHaveBeenCalledWith('accessToken')
  })

  test('should return null if Decrypter returns null', async () => {
    const { sut, decrypter } = makeDBLoudAccountByToken()
    jest.spyOn(decrypter, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.loadByToken('accessToken', 'anyRole')
    expect(response).toBeNull()
  })

  test('should call AccountRepository with correct values', async () => {
    const { sut, accountRepository } = makeDBLoudAccountByToken()
    const accountRepositorySpy = jest.spyOn(accountRepository, 'loadByToken')
    await sut.loadByToken('accessToken', 'anyRole')
    expect(accountRepositorySpy).toHaveBeenCalledWith('accessToken', 'anyRole')
  })

  test('should throws if AccountRepository throw', async () => {
    const { sut, accountRepository } = makeDBLoudAccountByToken()
    jest.spyOn(accountRepository, 'loadByToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const primise = sut.loadByToken('accessToken', 'anyRole')
    await expect(primise).rejects.toThrow()
  })

  test('should return null if AccountRepository returns null', async () => {
    const { sut, accountRepository } = makeDBLoudAccountByToken()
    jest.spyOn(accountRepository, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.loadByToken('accessToken', 'anyRole')
    expect(response).toBeNull()
  })

  test('should return accountModel on success', async () => {
    const { sut } = makeDBLoudAccountByToken()
    const response = await sut.loadByToken('accessToken', 'anyRole')
    expect(response).toEqual(makeFakeAccount())
  })

  test('should throws if AccountRepository throw', async () => {
    const { sut, decrypter } = makeDBLoudAccountByToken()
    jest.spyOn(decrypter, 'decrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const primise = sut.loadByToken('accessToken', 'anyRole')
    await expect(primise).rejects.toThrow()
  })
})
