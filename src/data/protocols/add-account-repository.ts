import { AddAccountModel } from '../../domain/usecases/add-account'
import { Account } from '../../domain/usecases/models/account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<Account>
}
