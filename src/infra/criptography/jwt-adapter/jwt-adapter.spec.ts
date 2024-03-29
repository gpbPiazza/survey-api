import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('any_token'))
  },
  async verify (): Promise<string> {
    return await new Promise(resolve => resolve('any_value'))
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secrect')
}
describe('JWT Adabpter', () => {
  describe('encrypt()', () => {
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

  describe('verify()', () => {
    test('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secrect')
    })

    test('should return a value when verify success', async () => {
      const sut = makeSut()

      const value = await sut.decrypt('any_value')

      expect(value).toBe('any_value')
    })

    test('should return null when verift throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error('any_error') })
      const response = await sut.decrypt('any_value')
      expect(response).toBeFalsy()
    })
  })
})
