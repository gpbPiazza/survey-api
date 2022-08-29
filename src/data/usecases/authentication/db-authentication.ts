import {
  Encrypter,
  HashComparer,
  UpdateAccessTokenRepository,
  Authentication,
  AuthenticationModel,
  LoadAccountByEmailRepository
} from './db-authentication-protocols'
export class DBAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (model: AuthenticationModel): Promise<string> {
    const accountModel = await this.loadAccountByEmailRepository.loadByEmail(model.email)
    if (!accountModel) {
      return null
    }

    const validPassword = await this.hashComparer.compare(model.password, accountModel.password)
    if (!validPassword) {
      return null
    }

    const { id } = accountModel

    const accessToken = await this.encrypter.encrypt(id)

    await this.updateAccessTokenRepository.updateAccessToken(id, accessToken)

    return accessToken
  }
}
