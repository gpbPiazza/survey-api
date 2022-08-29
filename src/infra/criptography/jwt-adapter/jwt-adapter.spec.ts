import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

describe('JWT Adabpter', () => {
  test('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secrect')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secrect')
  })

  test('should return a token when sign success', async () => {
    const sut = new JwtAdapter('secrect')

    const accessToken = await sut.encrypt('any_value')

    expect(accessToken).toBe('any_token')
  })
})
