import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('any_hash'))
  }
}))

const salt = 12

const makeBcryptAdapter = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const bcryptAdapter = makeBcryptAdapter()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await bcryptAdapter.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const bcryptAdapter = makeBcryptAdapter()

    const hash = await bcryptAdapter.encrypt('any_value')

    expect(hash).toBe('any_hash')
  })

  test('Should throw when bcrypt thow', async () => {
    const bcryptAdapter = makeBcryptAdapter()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error('any_error') })

    const promise = bcryptAdapter.encrypt('any_value')

    await expect(promise).rejects.toThrow()
  })
})
