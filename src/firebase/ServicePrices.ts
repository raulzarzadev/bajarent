import { where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { PriceType } from '../types/PriceType'
import { GetItemsOps } from './firebase.CRUD'
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
