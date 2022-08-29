import { AccountModel } from '../../../domain/models/account'

export interface LoadAccountByEmailRepository {
  loadByEmail: (emai: string) => Promise<AccountModel>
}
