import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secrect: string) {}
  async decrypt (value: string): Promise<string> {
    return await new Promise(resolve => resolve(null))
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secrect)
  }
}
