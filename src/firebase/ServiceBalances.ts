import { where } from 'firebase/firestore'
import type { BalanceType } from '../types/BalanceType'
import { FirebaseGenericService } from './genericService'

class ServiceBalancesClass extends FirebaseGenericService<BalanceType> {
	constructor() {
		super('balances')
	}

	async getByStore(storeId: string) {
		return this.getItems([where('storeId', '==', storeId)])
	}
}

export const ServiceBalances = new ServiceBalancesClass()
