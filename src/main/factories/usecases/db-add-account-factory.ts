
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { AddAccount } from '../../../domain/usecases/add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo-repository'
import env from '../../config/env'

export const makeAddAccount = (): AddAccount => {
  const encrypt = new BcryptAdapter(env.saltEncrypt)

  const addAccountRepository = new AccountMongoRepository()

  return new DbAddAccount(encrypt, addAccountRepository, addAccountRepository)
}
