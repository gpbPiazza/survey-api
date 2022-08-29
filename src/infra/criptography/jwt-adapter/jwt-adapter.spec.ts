import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
describe('JWT Adabpter', () => {
  test('should call sign with correct values ', async () => {
    const sut = new JwtAdapter('secrect')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secrect')
  })
})
