import { AccessDeniedError } from '../errors'
import { forbbiden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

interface MakeTypes {
  sut: AuthMiddleware
  loadAccountByToken: LoadAccountByToken
}

const makeAuthMiddleware = (): MakeTypes => {
  const loadAccountByToken = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByToken)
  return {
    sut,
    loadAccountByToken
  }
}
const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenTest implements LoadAccountByToken {
    async load (accessToken: string, role?: string | undefined): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByTokenTest()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'hashed_password'
})

const makeHttpRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    }
  }
}

describe('AuthMiddleware', () => {
  test('should 403 if no x-access-token existis in headers', async () => {
    const { sut } = makeAuthMiddleware()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByToken } = makeAuthMiddleware()
    const loadSpy = jest.spyOn(loadAccountByToken, 'load')
    const request = makeHttpRequest()
    await sut.handle(request)

    expect(loadSpy).toHaveBeenCalledWith(request.headers?.['x-access-token'])
  })

  test('should return 403 if LoadAccountByToken returns no account', async () => {
    const { sut, loadAccountByToken } = makeAuthMiddleware()
    jest.spyOn(loadAccountByToken, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const request = makeHttpRequest()
    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(forbbiden(new AccessDeniedError()))
  })

  test('should return 200 LoadAccountByToken if returns account', async () => {
    const { sut, loadAccountByToken } = makeAuthMiddleware()
    jest.spyOn(loadAccountByToken, 'load').mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
    const request = makeHttpRequest()
    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(ok({ accountID: 'valid_id' }))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByToken } = makeAuthMiddleware()
    jest.spyOn(loadAccountByToken, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const request = makeHttpRequest()
    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
