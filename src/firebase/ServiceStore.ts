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
  async currentItemNumber(storeId: string) {
    const store = await this.get(storeId)
    if (!store) {
      return
    }
    return store.currentItemNumber || '0000'
  }

  async incrementItemNumber({ storeId }) {
    const store = await this.get(storeId)
    if (!store) {
      return
    }
    const newNumber = nextItemNumber({ currentNumber: store.currentItemNumber })
    return newNumber
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const nextItemNumber = ({
  currentNumber = '0000'
}: {
  currentNumber: string
}) => {
  const newValue = parseInt(currentNumber) + 1
  return newValue.toString().padStart(5, '0')
}

export const ServiceStores = new ServiceStoresClass()
