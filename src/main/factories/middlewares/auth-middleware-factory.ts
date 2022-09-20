
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { makeDBLoadAccountByToken } from '../usecases/account/db-load-account-factory'

export const makeAuthMiddleware = (role?: string): AuthMiddleware => {
  return new AuthMiddleware(makeDBLoadAccountByToken(), role)
}
