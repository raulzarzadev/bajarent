import { where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { CategoryType } from '../types/RentItem'
class ServiceCategoriesClass extends FirebaseGenericService<CategoryType> {
	constructor() {
		super('categories')
	}

	async getByStore(storeId: string) {
		return this.getItems([where('storeId', '==', storeId)])
	}
}

export const ServiceCategories = new ServiceCategoriesClass()
