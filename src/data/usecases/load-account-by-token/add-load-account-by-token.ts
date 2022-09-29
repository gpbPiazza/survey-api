import { LoadAccountByToken } from '../../../domain/usecases/login/load-account-by-token'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DBLoudAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly accountRepository: LoadAccountByTokenRepository
  ) {}

  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    const isValidToken = await this.decrypter.decrypt(accessToken)
    if (!isValidToken) {
      return null
    }

    const account = await this.accountRepository.loadByToken(accessToken, role)
    if (!account) {
      return null
    }

    return account
  }
}
