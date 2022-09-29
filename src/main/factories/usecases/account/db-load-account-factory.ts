
import { DBLoudAccountByToken } from '../../../../data/usecases/load-account-by-token/add-load-account-by-token'
import { LoadAccountByToken } from '../../../../domain/usecases/login/load-account-by-token'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/repositories/no-sql/account-repository/account-mongo-repository'
import env from '../../../config/env'

export const makeDBLoadAccountByToken = (): LoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecrect)

  const accountRepository = new AccountMongoRepository()

  return new DBLoudAccountByToken(decrypter, accountRepository)
}
