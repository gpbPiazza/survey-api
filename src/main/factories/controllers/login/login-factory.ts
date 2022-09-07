import { Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controller/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { makeAuthentication } from '../../usecases/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeLoginValidation(), makeAuthentication())

  return makeLogControllerDecorator(loginController)
}
