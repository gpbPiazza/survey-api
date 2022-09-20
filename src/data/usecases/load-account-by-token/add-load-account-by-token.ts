import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DBLoudAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly accountRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    if (!token) {
      return null
    }

    const account = await this.accountRepository.loadByToken(token)
    if (!account) {
      return null
    }

    return account
  }
}
