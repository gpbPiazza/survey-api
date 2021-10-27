
import { AddAccount, AddAccountModel, Account, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<Account> {
    const { password } = addAccountModel
    const hashedPassword = await this.encrypter.encrypt(password)

    const accountToBeAdd = Object.assign({}, addAccountModel, { password: hashedPassword })

    await this.addAccountRepository.add(accountToBeAdd)

    return await new Promise(resolve => resolve(null))
  }
}
