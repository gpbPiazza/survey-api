import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { SignUpController } from '../../presentation/controller/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator/email-validator-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'

export const makeSignupController = (): Controller => {
  const salt = 12
  const encrypt = new BcryptAdapter(salt)

  const addAccountRepository = new AccountMongoRepository()

  const logMongoRepository = new LogMongoRepository()

  const dbAddAccount = new DbAddAccount(encrypt, addAccountRepository)

  const emailValidator = new EmailValidatorAdapter()

  const signUpController = new SignUpController(emailValidator, dbAddAccount, null)

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
