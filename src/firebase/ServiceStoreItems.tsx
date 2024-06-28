import { collection, where } from 'firebase/firestore'
import { ServiceStores } from './ServiceStore'
import ItemType from '../types/ItemType'
import { ServiceItemHistory } from './ServiceItemHistory'
import { db } from './main'
type Type = Partial<ItemType>
const SUB_COLLECTION = 'items'
export class ServiceStoreItemsClass {
  async add({ storeId, item }: { storeId: string; item: Type }) {
    const collectionRef = collection(db, 'stores', storeId, SUB_COLLECTION)

    return await ServiceStores.createRefItem({
      collectionRef,
      item: item
    })
  }

  async getAll(storeId: string) {
    return ServiceStores.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION
    })
  }
  async getActive(storeId: string) {
    return ServiceStores.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      filters: [where('isActive', '==', true)]
    })
  }
  async listenAvailableBySections({
    storeId,
    userSections = [],
    cb
  }: {
    storeId: string
    userSections: string[]
    cb: (items: Type[]) => void
  }) {
    if (userSections.length) {
      return ServiceStores.listenItemsInSubCollection({
        parentId: storeId,
        subCollection: SUB_COLLECTION,
        filters: [
          where('status', '==', 'pickedUp'),
          where('assignedSection', 'in', userSections)
        ],
        cb
      })
    } else {
      return ServiceStores.listenItemsInSubCollection({
        parentId: storeId,
        subCollection: SUB_COLLECTION,
        filters: [where('status', '==', 'pickedUp')],
        cb
      })
    }
  }

  async getSimilar(storeId: string, item: Partial<Type>) {
    const similarName = ServiceStores.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION
    })
    const similarPhone = ServiceStores.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      filters: [where('phone', '==', item.phone)]
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

  async get({ storeId, itemId }: { storeId: string; itemId: string }) {
    return ServiceStores.getItemInCollection({
      itemId,
      parentId: storeId,
      subCollection: SUB_COLLECTION
    })
  }

  async update({
    storeId,
    itemId,
    itemData
  }: {
    storeId: string
    itemId: string
    itemData: Partial<Type>
  }) {
    return ServiceStores.updateInSubCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      itemId,
      itemData
    })
  }

  async updateField({
    storeId,
    itemId,
    field,
    value
  }: {
    storeId: string
    itemId: string
    field: string
    value: any
  }) {
    return ServiceStores.updateFieldInSubCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      itemId,
      field,
      value
    })
  }

  async delete({ storeId, itemId }: { storeId: string; itemId: string }) {
    return ServiceStores.deleteInSubCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      itemId
    })
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceStoreItems = new ServiceStoreItemsClass()
