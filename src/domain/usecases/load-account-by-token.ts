import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  loadByToken: (accessToken: string, role?: string) => Promise<AccountModel>
}
