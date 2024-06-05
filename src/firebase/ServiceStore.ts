import { where } from 'firebase/firestore'
import StoreType from '../types/StoreType'
import { FirebaseGenericService } from './genericService'
import { ServiceStaff } from './ServiceStaff'
export class ServiceStoresClass extends FirebaseGenericService<StoreType> {
  constructor() {
    super('stores')
  }

  async getStoresByUserId(userId: string) {
    return this.getItems([where('createdBy', '==', userId)])
  }

  async getWhereUserIsStaff(userId: string) {
    const staffWithStore = await ServiceStaff.getItems([
      where('userId', '==', userId)
    ])
    const storesIds = staffWithStore.map(({ storeId }) => storeId)
    const staffStores = await Promise.all(storesIds.map((id) => this.get(id)))
    const removeInvalid = staffStores.filter((store) => !!store)
    return removeInvalid
  }

  async userStores(userId: string) {
    const asStaff = await this.getWhereUserIsStaff(userId)
    const asOwner = await this.getStoresByUserId(userId)
    const uniqueStores = new Set([
      ...asStaff.map(({ id }) => id),
      ...asOwner.map(({ id }) => id)
    ])
    return Array.from(uniqueStores).map((id) =>
      [...asStaff, ...asOwner].find((store) => store.id === id)
    )
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceStores = new ServiceStoresClass()
