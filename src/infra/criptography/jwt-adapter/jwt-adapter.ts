import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secrect: string) {}
  async decrypt (token: string): Promise<string> {
    const value: any = await jwt.verify(token, this.secrect)
    return value
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secrect)
  }
}
