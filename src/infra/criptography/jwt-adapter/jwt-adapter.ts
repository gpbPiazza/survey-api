import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter {
  private readonly secrect: string
  constructor (secrect: string) {
    this.secrect = secrect
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secrect)
  }
}
