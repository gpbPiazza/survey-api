import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter {
  constructor (private readonly secrect: string) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secrect)
  }
}
