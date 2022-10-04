import { AccountModel } from '../../models/account'

export type AddAccountParam = {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: AddAccountParam) => Promise<AccountModel>
}
