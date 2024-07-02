import { increment, where } from 'firebase/firestore'
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
    const valorHex = store.currentItemNumber || '0000'
    let valorDecimal = parseInt(valorHex, 16)
    // const newHexVal = valorDecimal.toString(16).padStart(4, '0') // Convertir de nuevo a hexadecimal y asegurar 4 dígitos
    const newHexVal = sumHexDec({ hex: valorHex, dec: 1 })
    await this.update(storeId, { currentItemNumber: newHexVal.toUpperCase() }) // Asumiendo que `update` es una operación asíncrona
    return newHexVal
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const sumHexDec = ({ hex, dec }: { hex: string; dec?: number }) => {
  let valorDecimal1 = parseInt(hex, 16)
  let valorDecimal = valorDecimal1 + dec // Incrementar el valor decimal directamente
  const newHexVal = valorDecimal.toString(16).padStart(4, '0') // Convertir de nuevo a hexadecimal y asegurar 4 dígitos
  return newHexVal
}

export const ServiceStores = new ServiceStoresClass()
