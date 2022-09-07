import { LoadAccountByEmailRepository, AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async add (addAccountModel: AddAccountModel): Promise<AccountModel> {
    const { password, email } = addAccountModel
    await this.loadAccountByEmailRepository.loadByEmail(email)

    const hashedPassword = await this.hasher.hash(password)

    const accountToBeAdd = Object.assign({}, addAccountModel, { password: hashedPassword })

    const account = await this.addAccountRepository.add(accountToBeAdd)

    return await new Promise(resolve => resolve(account))
  }
}
