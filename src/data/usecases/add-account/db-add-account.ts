import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { Account } from '../../../domain/usecases/models/account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<Account> {
    const { password } = account
    const hashedPassword = await this.encrypter.encrypt(password)

    return await new Promise(resolve => resolve(null))
  }
}
