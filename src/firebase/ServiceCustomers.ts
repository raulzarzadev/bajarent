import { where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import { GetItemsOps } from './firebase.CRUD'
import { CustomerType } from '../state/features/costumers/customerType'
class ServiceCustomersClass extends FirebaseGenericService<CustomerType> {
  constructor() {
    super('customers')
  }
  async getByStore(storeId: string, ops?: GetItemsOps) {
    return this.getItems([where('storeId', '==', storeId)], ops)
  }
}

export const ServiceCustomers = new ServiceCustomersClass()
