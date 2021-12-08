import { Account, AddAccountModel, Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'

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
    async add (accountData: AddAccountModel): Promise<Account> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepository()
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

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await dbAddAccount.add(accountData)
    expect(encrypterSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Encrypter throws', async () => {
    const { encrypter, dbAddAccount } = makeDbAddAccount()

    jest.spyOn(encrypter, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const promise = dbAddAccount.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository if correct values', async () => {
    const { addAccountRepository, dbAddAccount } = makeDbAddAccount()

    const addAccountRepositorySpy = jest.spyOn(addAccountRepository, 'add')

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    await dbAddAccount.add(accountData)

    const accountWithHashedPassword = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }

    expect(addAccountRepositorySpy).toHaveBeenLastCalledWith(accountWithHashedPassword)
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { addAccountRepository, dbAddAccount } = makeDbAddAccount()

    jest.spyOn(addAccountRepository, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const promise = dbAddAccount.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an Account on success', async () => {
    const { dbAddAccount } = makeDbAddAccount()

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }

    const account = await dbAddAccount.add(accountData)

    const expectedAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }

    expect(account).toStrictEqual(expectedAccount)
  })
})
