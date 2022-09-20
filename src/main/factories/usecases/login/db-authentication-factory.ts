import { DBAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/repositories/no-sql/account-repository/account-mongo-repository'
import env from '../../../config/env'

export const makeAuthentication = (): Authentication => {
  const encrypt = new BcryptAdapter(env.saltEncrypt)

  const addAccountRepository = new AccountMongoRepository()

  const jwtAdabter = new JwtAdapter(env.jwtSecrect)

  return new DBAuthentication(addAccountRepository, encrypt, jwtAdabter, addAccountRepository)
}
