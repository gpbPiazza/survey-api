import { SignUpController } from '../../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log-repository/log-mongo-repository'
import { makeSignupValidation } from './signup-validation-factory'
import { makeAuthentication } from '../../usecases/db-authentication-factory'
import { makeAddAccount } from '../../usecases/db-add-account-factory'

export const makeSignupController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()

  const signUpController = new SignUpController(makeAddAccount(), makeSignupValidation(), makeAuthentication())

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
