import { where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { PriceType } from '../types/PriceType'
class ServicePricesClass extends FirebaseGenericService<PriceType> {
  constructor() {
    super('prices')
  }

  async getByCategory(categoryId: string) {
    return this.getItems([where('categoryId', '==', categoryId)])
  }

  async getByStore(storeId: string) {
    return this.getItems([where('storeId', '==', storeId)])
  }
}

export const ServicePrices = new ServicePricesClass()
