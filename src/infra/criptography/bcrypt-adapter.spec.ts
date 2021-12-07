import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('any_hash'))
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await bcryptAdapter.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const salt = 12
    const bcryptAdapter = new BcryptAdapter(salt)

    const hash = await bcryptAdapter.encrypt('any_value')

    expect(hash).toBe('any_hash')
  })
})
