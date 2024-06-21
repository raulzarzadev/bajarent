import { where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { BalanceType } from '../types/BalanceType'

class ServiceBalancesClass extends FirebaseGenericService<BalanceType> {
  constructor() {
    super('balances')
  }

  async getByStore(storeId: string) {
    return this.getItems([where('storeId', '==', storeId)])
  }
}

export const ServiceBalances = new ServiceBalancesClass()
