import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DBAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (model: AuthenticationModel): Promise<string> {
    const accountModel = await this.loadAccountByEmailRepository.load(model.email)
    console.log(accountModel.id)
    return await new Promise(resolve => resolve('zap'))
  }
}
