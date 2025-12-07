import { where } from 'firebase/firestore'
import type { PriceType } from '../types/PriceType'
import type { GetItemsOps } from './firebase.CRUD'
import { FirebaseGenericService } from './genericService'

class ServicePricesClass extends FirebaseGenericService<PriceType> {
	constructor() {
		super('prices')
	}

	async getByCategory(categoryId: string, ops?: GetItemsOps) {
		return this.getItems([where('categoryId', '==', categoryId)], ops)
	}

	async getByStore(storeId: string, ops?: GetItemsOps) {
		return this.getItems([where('storeId', '==', storeId)], ops)
	}
}

export const ServicePrices = new ServicePricesClass()
