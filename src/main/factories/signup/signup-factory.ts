import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { SignUpController } from '../../../presentation/controller/signup/signup-controller'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { makeSignupValidation } from './signup-validation-factory'
import env from '../../config/env'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { DBAuthentication } from '../../../data/usecases/authentication/db-authentication'

export const makeSignupController = (): Controller => {
  const encrypt = new BcryptAdapter(env.saltEncrypt)

  const addAccountRepository = new AccountMongoRepository()

  const logMongoRepository = new LogMongoRepository()

  const dbAddAccount = new DbAddAccount(encrypt, addAccountRepository)

  const jwtAdabter = new JwtAdapter(env.jwtSecrect)

  const dBAuthentication = new DBAuthentication(addAccountRepository, encrypt, jwtAdabter, addAccountRepository)

  const signUpController = new SignUpController(dbAddAccount, makeSignupValidation(), dBAuthentication)

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
