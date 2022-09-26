import { AccountModel, AddAccountModel, Hasher } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'

const makeHasher = (): Hasher => {
  class HashserStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HashserStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepository implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepository()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'hashed_password'
})

const makeFakeAddAccountModel = (): AddAccountModel => {
  const { name, email } = makeFakeAccount()
  return { name, email, password: 'not_hashed_password' }
}

const makeLoadAccountRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

type MakeTypes = {
  dbAddAccount: DbAddAccount
  hasher: Hasher
  addAccountRepository: AddAccountRepository
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}

const makeDbAddAccount = (): MakeTypes => {
  const hasher = makeHasher()
  const addAccountRepository = makeAddAccountRepository()
  const loadAccountByEmailRepository = makeLoadAccountRepositoryStub()
  const dbAddAccount = new DbAddAccount(hasher, addAccountRepository, loadAccountByEmailRepository)
  return {
    hasher,
    dbAddAccount,
    addAccountRepository,
    loadAccountByEmailRepository
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { hasher, dbAddAccount } = makeDbAddAccount()

    const hasherSpy = jest.spyOn(hasher, 'hash')

    const accountData = makeFakeAddAccountModel()

    await dbAddAccount.add(accountData)
    expect(hasherSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { hasher, dbAddAccount } = makeDbAddAccount()

    jest.spyOn(hasher, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = dbAddAccount.add(makeFakeAddAccountModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository if correct values', async () => {
    const { addAccountRepository, dbAddAccount } = makeDbAddAccount()

    const addAccountRepositorySpy = jest.spyOn(addAccountRepository, 'add')

    const accountDataWithNotHashedPassword = makeFakeAddAccountModel()

    await dbAddAccount.add(accountDataWithNotHashedPassword)

    const { name, email } = accountDataWithNotHashedPassword
    const accountWithHashedPassword = {
      name,
      email,
      password: 'hashed_password'
    }

    expect(addAccountRepositorySpy).toHaveBeenLastCalledWith(accountWithHashedPassword)
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { addAccountRepository, dbAddAccount } = makeDbAddAccount()

    jest.spyOn(addAccountRepository, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = dbAddAccount.add(makeFakeAddAccountModel())

    await expect(promise).rejects.toThrow()
  })

  test('Should return an Account on success', async () => {
    const { dbAddAccount } = makeDbAddAccount()

    const account = await dbAddAccount.add(makeFakeAddAccountModel())

    expect(account).toStrictEqual(makeFakeAccount())
  })

  test('should call LoadAccountByEmailRepository with correct email ', async () => {
    const { dbAddAccount, loadAccountByEmailRepository } = makeDbAddAccount()

    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')

    const addAccountModel = makeFakeAddAccountModel()
    await dbAddAccount.add(addAccountModel)

    expect(loadSpy).toHaveBeenCalledWith(addAccountModel.email)
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { dbAddAccount, loadAccountByEmailRepository } = makeDbAddAccount()

    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = dbAddAccount.add(makeFakeAddAccountModel())

    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { dbAddAccount, loadAccountByEmailRepository } = makeDbAddAccount()

    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))

    const account = await dbAddAccount.add(makeFakeAddAccountModel())

    expect(account).toBeNull()
  })
})
