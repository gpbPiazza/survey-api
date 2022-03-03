import { AddAccountModel } from '../../domain/usecases/add-account'
import { Account } from '../../domain/models/account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<Account>
}
