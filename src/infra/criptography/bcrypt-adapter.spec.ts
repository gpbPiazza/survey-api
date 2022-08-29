import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('any_hash'))
  },
  async compare (value: string, hash: string): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

const salt = 12

const makeBcryptAdapter = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const bcryptAdapter = makeBcryptAdapter()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await bcryptAdapter.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const bcryptAdapter = makeBcryptAdapter()

    const hash = await bcryptAdapter.hash('any_value')

    expect(hash).toBe('any_hash')
  })

  test('Should throw when hash thow', async () => {
    const bcryptAdapter = makeBcryptAdapter()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error('any_error') })

    const promise = bcryptAdapter.hash('any_value')

    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const bcryptAdapter = makeBcryptAdapter()

    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await bcryptAdapter.compare('any_value', 'any_hash')

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  test('Should throw when compare throws', async () => {
    const bcryptAdapter = makeBcryptAdapter()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error('any_error') })

    const promise = await bcryptAdapter.compare('any_value', 'any_hash')

    expect(promise).rejects.toThrow()
  })
})
