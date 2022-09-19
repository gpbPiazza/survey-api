import { AccessDeniedError } from '../errors'
import { forbbiden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
describe('AuthMiddleware', () => {
  test('should 403 if no x-access-token existis in headers ', async () => {
    const sut = new AuthMiddleware()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
  })
})
