import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { LoginController } from '../../../../presentation/controller/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { makeAuthentication } from '../../usecases/db-authentication-factory'

export const makeLoginController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()

  const loginController = new LoginController(makeLoginValidation(), makeAuthentication())

  return new LogControllerDecorator(loginController, logMongoRepository)
}
