import { AccountModel } from '../../domain/models/account'

export interface LoadAccountByEmailRepository {
  load: (emai: string) => Promise<AccountModel>
}
