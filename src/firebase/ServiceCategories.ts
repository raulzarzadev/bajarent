import { where } from 'firebase/firestore'
import type { CategoryType } from '../types/RentItem'
import { FirebaseGenericService } from './genericService'

class ServiceCategoriesClass extends FirebaseGenericService<CategoryType> {
	constructor() {
		super('categories')
	}

	async getByStore(storeId: string) {
		return this.getItems([where('storeId', '==', storeId)])
	}
}

export const ServiceCategories = new ServiceCategoriesClass()
