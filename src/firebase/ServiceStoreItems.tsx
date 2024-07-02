import { collection, where } from 'firebase/firestore'
import { ServiceStores } from './ServiceStore'
import ItemType from '../types/ItemType'
import {
  ItemHistoryBase,
  ItemHistoryType,
  ServiceItemHistory
} from './ServiceItemHistory'
import { db } from './main'
type Type = Partial<ItemType>
const SUB_COLLECTION = 'items'
export class ServiceStoreItemsClass {
  async add({ storeId, item }: { storeId: string; item: Type }) {
    const collectionRef = collection(db, 'stores', storeId, SUB_COLLECTION)
    item.number = await ServiceStores.incrementItemNumber({
      storeId
    })
    console.log({ item })
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
  async getAvailable(
    {
      storeId,
      sections
    }: {
      storeId: string
      sections?: string[]
    },
    props: { justRefs?: boolean } = {}
  ) {
    const justRefs = props.justRefs || false
    const filters = [where('status', '==', 'pickedUp')]
    if (sections?.length) {
      filters.push(where('assignedSection', 'in', sections))
    }
    return ServiceStores.getItemsInCollection(
      {
        parentId: storeId,
        subCollection: SUB_COLLECTION,
        filters
      },
      {
        justRefs
      }
    )
  }
  async listenAvailableBySections({
    storeId,
    userSections = [],
    cb
  }: {
    storeId: string
    userSections?: string[]
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

  async addEntry({
    storeId,
    itemId,
    entry
  }: {
    storeId: string
    itemId: string
    entry: ItemHistoryBase
  }) {
    return ServiceItemHistory.addEntry({
      entry,
      itemId,
      storeId
    })
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceStoreItems = new ServiceStoreItemsClass()
