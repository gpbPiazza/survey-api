import { DBAuthentication } from './db-authentication'
import {
  Encrypter,
  HashComparer,
  AccountModel,
  UpdateAccessTokenRepository,
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository
} from './db-authentication-protocols'

type SutTypes = {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: Authentication
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
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

const makeFakeAuthenticationModel = (): AuthenticationModel => {
  return {
    email: 'any_email@email.com',
    password: 'any_password'
  }
}

const makeLoadAccountRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return await new Promise(resolve => resolve('access_token'))
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, accessToken: string): Promise<void> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DBAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    loadAccountByEmailRepositoryStub,
    sut,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DBAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email ', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.auth(makeFakeAuthenticationModel())

    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)

    const accessToken = await sut.auth(makeFakeAuthenticationModel())

    expect(accessToken).toBeNull()
  })

  test('should call HasCompare witch correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    const authModel = makeFakeAuthenticationModel()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(authModel)

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })

  test('should return null if HasCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    const authModel = makeFakeAuthenticationModel()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const accessToken = await sut.auth(authModel)

    expect(accessToken).toBeNull()
  })

  test('should call Encrypter witch correct id', async () => {
    const { sut, encrypterStub } = makeSut()

    const accountModel = makeFakeAccount()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthenticationModel())

    expect(encryptSpy).toHaveBeenCalledWith(accountModel.id)
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })

  test('should return access token when valid data is provided', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthenticationModel())

    expect(accessToken).toEqual('access_token')
  })

  test('should call UpdateAccessTokenRepository witch values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const accountModel = makeFakeAccount()

    const encryptSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

    const accessToken = await sut.auth(makeFakeAuthenticationModel())

    expect(encryptSpy).toHaveBeenCalledWith(accountModel.id, accessToken)
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthenticationModel())

    await expect(promise).rejects.toThrow()
  })
})
