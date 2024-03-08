import { where } from 'firebase/firestore'
import StoreType from '../types/StoreType'
import { FirebaseGenericService } from './genericService'
class ServiceStoresClass extends FirebaseGenericService<StoreType> {
  constructor() {
    super('stores')
  }

  async getStoresByUserId(userId: string) {
    return this.getItems([where('createdBy', '==', userId)])
  }

  async getWhereUserIsStaff(userId: string) {
    return this.getItems([where('staff', 'array-contains', userId)])
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceStores = new ServiceStoresClass()
