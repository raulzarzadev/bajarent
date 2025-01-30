import { deleteField, where } from 'firebase/firestore'
import { FirebaseGenericService } from './genericService'
import {
  CustomerCompiledType,
  CustomerType
} from '../state/features/costumers/customerType'
import { GetItemsOps } from './firebase.CRUD'

class ServiceCustomersCompiledClass extends FirebaseGenericService<{
  id: string
  storeId: string
  customers: Record<CustomerType['id'], CustomerCompiledType>
}> {
  constructor() {
    super('customersCompiled')
  }
  addCustomer = async (
    storeId: string,
    customerId: string,
    customer: CustomerCompiledType
  ) => {
    return this.update(storeId, {
      [`customers.${customerId}`]: customer
    })
  }
  /**
   *
   * @param storeId
   * @param customerId
   * @param customer  should you pass the whole customer object or just the fields you want to update?
   * @returns
   */
  async updateCustomer(
    storeId: string,
    customerId: string,
    customer: CustomerCompiledType
  ) {
    return this.update(storeId, {
      [`customers.${customerId}`]: customer
    })
  }

  async deleteCustomer(storeId: string, customerId: string) {
    return this.update(storeId, {
      [`customers.${customerId}`]: deleteField()
    })
  }
  async getByStore(storeId: string, ops?: GetItemsOps) {
    return this.getItems([where('storeId', '==', storeId)], ops)
  }
}

export const ServiceCustomersCompiled = new ServiceCustomersCompiledClass()
