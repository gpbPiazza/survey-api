import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secrect')
}
describe('JWT Adabpter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_value')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secrect')
    })

    test('should return a token when sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt('any_value')

      expect(accessToken).toBe('any_token')
    })

    test('should throws when sign throw', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error('any_error') })
      const promise = sut.encrypt('any_value')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('sign()', () => {
    test('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_value')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secrect')
    })

    test('should return a token when sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt('any_value')

      expect(accessToken).toBe('any_token')
    })

    test('should throws when sign throw', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error('any_error') })
      const promise = sut.encrypt('any_value')

      await expect(promise).rejects.toThrow()
    })
  })
})
