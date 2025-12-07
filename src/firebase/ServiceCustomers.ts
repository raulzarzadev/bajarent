import { where } from 'firebase/firestore'
import type { CustomerType } from '../state/features/costumers/customerType'
import type { GetItemsOps } from './firebase.CRUD'
import { FirebaseGenericService } from './genericService'

class ServiceCustomersClass extends FirebaseGenericService<CustomerType> {
	constructor() {
		super('customers')
	}
	async getByStore(storeId: string, ops?: GetItemsOps) {
		return this.getItems([where('storeId', '==', storeId)], ops)
	}
}

export const ServiceCustomers = new ServiceCustomersClass()
