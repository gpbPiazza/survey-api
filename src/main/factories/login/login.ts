import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LoginController } from '../../../presentation/controller/login/login'
import { makeLoginValidation } from './login-validation'

export const makeLoginController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()

  const loginController = new LoginController(makeLoginValidation(), null)

  return new LogControllerDecorator(loginController, logMongoRepository)
}
