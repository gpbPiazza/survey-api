
import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher
  private readonly addAccountRepository: AddAccountRepository

  constructor (hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const { password } = addAccountModel
    const hashedPassword = await this.hasher.hash(password)

    const accountToBeAdd = Object.assign({}, addAccountModel, { password: hashedPassword })

    const account = await this.addAccountRepository.add(accountToBeAdd)

    return await new Promise(resolve => resolve(account))
  }
}
