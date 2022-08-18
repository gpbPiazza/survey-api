import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { SignUpController } from '../../presentation/controller/signup/signup'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { makeSignupValidation } from './signup-validation'

export const makeSignupController = (): Controller => {
  const salt = 12
  const encrypt = new BcryptAdapter(salt)

  const addAccountRepository = new AccountMongoRepository()

  const logMongoRepository = new LogMongoRepository()

  const dbAddAccount = new DbAddAccount(encrypt, addAccountRepository)

  const signUpController = new SignUpController(dbAddAccount, makeSignupValidation())

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
