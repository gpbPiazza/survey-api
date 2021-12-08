import { Account } from '../../../../domain/usecases/models/account'

export const map = (account: any): Account => {
  const { _id, name, password, email } = account

  return Object.assign({}, { name, password, email }, { id: _id.toHexString() })
}
