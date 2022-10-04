import {
  Encrypter,
  HashComparer,
  UpdateAccessTokenRepository,
  Authentication,
  AuthenticationParam,
  LoadAccountByEmailRepository
} from './db-authentication-protocols'
export class DBAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository) {}

  async auth (model: AuthenticationParam): Promise<string> {
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
