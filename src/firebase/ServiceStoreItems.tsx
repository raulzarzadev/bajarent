import {
  collection,
  documentId,
  increment,
  query,
  where
} from 'firebase/firestore'
import { ServiceStores } from './ServiceStore'
import ItemType, { ItemStatuses } from '../types/ItemType'
import { ItemHistoryBase, ServiceItemHistory } from './ServiceItemHistory'
import { db } from './main'
import { FormattedResponse, GetItemsOps } from './firebase.CRUD'
type Type = Partial<ItemType>
type Field = keyof Type
const SUB_COLLECTION = 'items'

export class ServiceStoreItemsClass {
  async add({ storeId, item }: { storeId: string; item: Type }): Promise<{
    newItem: Type
    ok: boolean
    res: any
  }> {
    //* FIRST UPDATE ECO NUMBER IN STORE
    await ServiceStores.update(storeId, { currentEco: increment(1) })
    //* SECOND CREATE ITEM
    const nextNumber = (await ServiceStores.get(storeId))
      .currentEco as unknown as number
    const nextStringNumber = nextNumber.toString().padStart(5, '0')
    const newItem = { ...item, number: nextStringNumber, eco: nextNumber }

    const collectionRef = collection(db, 'stores', storeId, SUB_COLLECTION)
    const createItemRes = await ServiceStores.createRefItem({
      collectionRef,
      item: newItem
    })
    return { ...createItemRes, newItem } as FormattedResponse & {
      newItem: Type
    }
  }

  async getAll(
    {
      storeId,
      sections,
      justActive
    }: { storeId: string; sections?: string[]; justActive?: true },
    ops?: GetItemsOps
  ): Promise<Type[]> {
    const filters = []
    if (sections?.length) {
      filters.push(where('assignedSection', 'in', sections))
    }
    if (justActive) {
      filters.push(
        where('status', 'in', [ItemStatuses.rented, ItemStatuses.pickedUp])
      )
    }

    const storeItemsRef = ServiceStores.getSubCollectionRef(
      storeId,
      SUB_COLLECTION
    )
    return ServiceStores.getRefItems(
      {
        collectionRef: storeItemsRef,
        filters
      },
      ops
    )
    // return ServiceStores.getItemsInCollection(
    //   {
    //     parentId: storeId,
    //     subCollection: SUB_COLLECTION,
    //     filters
    //   },
    //   ops
    // )
  }

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
  listenAvailableBySections({
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
  ): Promise<Type> {
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
      field: field as string,
      value
    })
      .then((res) => res)
      .catch((err) => {
        console.log({ err, field, value, SUB_COLLECTION })
        return err
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

  async getList(
    {
      storeId,
      ids
    }: {
      storeId: string
      ids: string[]
    },
    ops?: GetItemsOps
  ): Promise<Type[]> {
    const ref = collection(db, 'stores', storeId, SUB_COLLECTION)
    let promises = []
    const MAX_BATCH_SIZE = 30
    for (let i = 0; i < ids.length; i += MAX_BATCH_SIZE) {
      const chunk = ids.slice(i, i + MAX_BATCH_SIZE)
      promises.push(
        ServiceStores.getRefItems(
          {
            collectionRef: ref,
            filters: [where(documentId(), 'in', chunk)]
          },
          ops
        )
      )
    }
    return Promise.all(promises).then((res) => res.flat())
  }

  async getFieldBetweenDates(
    {
      storeId,
      field,
      fromDate,
      toDate
    }: {
      storeId: string
      fromDate: Date
      field: 'createdAt' | 'updatedAt' | 'retiredAt'
      toDate: Date
    },
    ops?: GetItemsOps
  ) {
    return ServiceStores.getItemsInCollection(
      {
        parentId: storeId,
        subCollection: SUB_COLLECTION,
        filters: [where(field, '>=', fromDate), where(field, '<=', toDate)]
      },
      ops
    )
  }

  async search({
    storeId,
    fields = [],
    value
  }: {
    storeId: string
    fields: (keyof ItemType)[]
    value: string
  }): Promise<Type[]> {
    if (fields.length === 0) {
      console.error('this query its empty')
      return []
    }
    const queries = fields.map((field) => {
      const collectionRef = collection(db, 'stores', storeId, SUB_COLLECTION)
      return ServiceStores.getRefItems<Type>({
        collectionRef,
        filters: [where(field as string, '==', value)]
      })
    })
    const results = await Promise.all(queries)
    return results.flat()
  }

  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const ServiceStoreItems = new ServiceStoreItemsClass()
