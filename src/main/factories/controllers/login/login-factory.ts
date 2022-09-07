import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { LoginController } from '../../../../presentation/controller/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { DBAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../../config/env'

export const makeLoginController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()

  const bcryptAdapter = new BcryptAdapter(env.saltEncrypt)

  const jwtAdabter = new JwtAdapter(env.jwtSecrect)

  const accountMongoRepository = new AccountMongoRepository()

  const dBAuthentication = new DBAuthentication(accountMongoRepository, bcryptAdapter, jwtAdabter, accountMongoRepository)

  const loginController = new LoginController(makeLoginValidation(), dBAuthentication)

  return new LogControllerDecorator(loginController, logMongoRepository)
}
