import { SignUpController } from '../../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignupValidation } from './signup-validation-factory'
import { makeAuthentication } from '../../usecases/login/db-authentication-factory'
import { makeAddAccount } from '../../usecases/account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignupController = (): Controller => {
  const signUpController = new SignUpController(makeAddAccount(), makeSignupValidation(), makeAuthentication())

  return makeLogControllerDecorator(signUpController)
}
