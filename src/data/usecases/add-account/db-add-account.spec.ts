import { AccountModel, AddAccountModel, Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository } from '../../protocols/db/add-account-repository'

const makeEncrypter = (): Encrypter => {
  class Encrypter implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new Encrypter()
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
  email: 'valid_email',
  password: 'hashed_password'
})

const makeFakeAddAccountModel = (): AddAccountModel => {
  const { name, email } = makeFakeAccount()
  return { name, email, password: 'not_hashed_password' }
}

interface MakeTypes {
  dbAddAccount: DbAddAccount
  encrypter: Encrypter
  addAccountRepository: AddAccountRepository
}

const makeDbAddAccount = (): MakeTypes => {
  const encrypter = makeEncrypter()
  const addAccountRepository = makeAddAccountRepository()
  const dbAddAccount = new DbAddAccount(encrypter, addAccountRepository)
  return {
    encrypter,
    dbAddAccount,
    addAccountRepository
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encrypter, dbAddAccount } = makeDbAddAccount()

    const encrypterSpy = jest.spyOn(encrypter, 'encrypt')

    const accountData = makeFakeAddAccountModel()

    await dbAddAccount.add(accountData)
    expect(encrypterSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Encrypter throws', async () => {
    const { encrypter, dbAddAccount } = makeDbAddAccount()

    jest.spyOn(encrypter, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

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
})
