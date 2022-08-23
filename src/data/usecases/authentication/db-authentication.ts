import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
export class DBAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (model: AuthenticationModel): Promise<string> {
    const accountModel = await this.loadAccountByEmailRepository.load(model.email)
    if (!accountModel) {
      return null
    }

    const validPassword = await this.hashComparer.compare(model.password, accountModel.password)
    if (!validPassword) {
      return null
    }

    return null
  }
}
