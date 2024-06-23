import { FirebaseGenericService } from './genericService'
import { ClientType } from '../types/ClientType'
import { where } from 'firebase/firestore'

const SUB_COLLECTION = 'clients'
export class ServiceStoreClientsClass extends FirebaseGenericService<ClientType> {
  constructor() {
    super('stores')
  }

  async add(storeId: string, clientData: Partial<ClientType>) {
    return this.createInSubCollection(storeId, SUB_COLLECTION, clientData)
  }

  async getAll(storeId: string) {
    return this.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION
    })
  }
  async getActive(storeId: string) {
    return this.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      filters: [where('isActive', '==', false)]
    })
  }

  async getSimilar(storeId: string, client: Partial<ClientType>) {
    const similarName = this.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      filters: [where('name', '==', client.name)]
    })
    const similarPhone = this.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      filters: [where('phone', '==', client.phone)]
    })

    return Promise.all([similarName, similarPhone]).then((res) => {
      const batch = res.flat()
      // remove duplicates
      const unique = batch.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      )
      return unique
    })
  }

  async getItem({ storeId, itemId }: { storeId: string; itemId: string }) {
    return this.getItemInCollection({
      itemId,
      parentId: storeId,
      subCollection: SUB_COLLECTION
    })
  }

  async updateItem({
    storeId,
    itemId,
    itemData
  }: {
    storeId: string
    itemId: string
    itemData: Partial<ClientType>
  }) {
    return this.updateInSubCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      itemId,
      itemData
    })
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceStoreClients = new ServiceStoreClientsClass()
