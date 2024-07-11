import { collection, documentId, where } from 'firebase/firestore'
import { ServiceStores } from './ServiceStore'
import ItemType from '../types/ItemType'
import { ItemHistoryBase, ServiceItemHistory } from './ServiceItemHistory'
import { db } from './main'
import { FormattedResponse, GetItemsOps } from './firebase.CRUD'
type Type = Partial<ItemType>
type Field = keyof Type
const SUB_COLLECTION = 'items'
export class ServiceStoreItemsClass {
  async add({ storeId, item }: { storeId: string; item: Type }) {
    //* 1. get current number
    const collectionRef = collection(db, 'stores', storeId, SUB_COLLECTION)
    const newNUmber = await ServiceStores.incrementItemNumber({
      storeId
    })
    //* 2. update item number
    await ServiceStores.update(storeId, {
      currentItemNumber: newNUmber
    })
    //* 3. create item
    const newItem = await ServiceStores.createRefItem({
      collectionRef,
      item: { ...item, number: newNUmber }
    })

    return newItem as FormattedResponse
  }

  async getAll(
    { storeId, sections }: { storeId: string; sections?: string[] },
    ops?: GetItemsOps
  ) {
    const filters = []
    if (sections?.length) {
      filters.push(where('assignedSection', 'in', sections))
    }
    return ServiceStores.getItemsInCollection(
      {
        parentId: storeId,
        subCollection: SUB_COLLECTION,
        filters: filters.length > 0 ? filters : undefined
      },
      ops
    )
  }

  // async getActive(storeId: string) {
  //   return ServiceStores.getItemsInCollection({
  //     parentId: storeId,
  //     subCollection: SUB_COLLECTION,
  //     filters: [where('isActive', '==', true)]
  //   })
  // }
  async getAvailable(
    {
      storeId,
      sections
    }: {
      storeId: string
      sections?: string[]
    },
    ops?: GetItemsOps
  ) {
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
      ops
    )
  }
  async listenAvailableBySections({
    storeId,
    userSections = [],
    cb
  }: {
    storeId: string
    userSections?: string[] | 'all'
    cb: (items: Type[]) => void
  }) {
    if (Array.isArray(userSections) && userSections.length > 0) {
      return ServiceStores.listenItemsInSubCollection({
        parentId: storeId,
        subCollection: SUB_COLLECTION,
        filters: [
          where('status', '==', 'pickedUp'),
          where('assignedSection', 'in', userSections)
        ],
        cb
      })
    }
    if (userSections === 'all') {
      console.log('all sectis')
      return ServiceStores.listenItemsInSubCollection({
        parentId: storeId,
        subCollection: SUB_COLLECTION,
        filters: [where('status', '==', 'pickedUp')],
        cb
      })
    }
  }

  async get(
    { storeId, itemId }: { storeId: string; itemId: string },
    ops?: GetItemsOps
  ) {
    return ServiceStores.getItemInCollection(
      {
        itemId,
        parentId: storeId,
        subCollection: SUB_COLLECTION
      },
      ops
    )
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

  async updateField<F extends Field>({
    storeId,
    itemId,
    field,
    value
  }: {
    storeId: string
    itemId: string
    field: F
    value: Type[F]
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

  async getList({
    storeId,
    ids
  }: {
    storeId: string
    ids: string[]
  }): Promise<Type[]> {
    const ref = collection(db, 'stores', storeId, SUB_COLLECTION)
    return await ServiceStores.getRefItems({
      collectionRef: ref,
      filters: [where(documentId(), 'in', ids)]
    })
  }
  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceStoreItems = new ServiceStoreItemsClass()
