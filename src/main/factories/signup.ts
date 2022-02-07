import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { SignUpController } from '../../presentation/controller/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator/email-validator-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignupController = (): SignUpController => {
  const salt = 12

  const encrypt = new BcryptAdapter(salt)

  const addAccountRepository = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(encrypt, addAccountRepository)

  const emailValidator = new EmailValidatorAdapter()

  return new SignUpController(emailValidator, dbAddAccount)
}
