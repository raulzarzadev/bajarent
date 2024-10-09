import {
  QueryConstraint,
  collection,
  limit,
  orderBy,
  where
} from 'firebase/firestore'
import { db } from './main'
import { FirebaseGenericService } from './genericService'
import BaseType from '../types/BaseType'
import { endDate, startDate } from '../libs/utils-date'
import { ServiceStoreItems } from './ServiceStoreItems'
import ItemType from '../types/ItemType'

const COLLECTION = 'stores'
const SUB_COLLECTION = 'items'
const SUB_COLLECTION_2 = 'history'

export type ItemHistoryBase = {
  type:
    | 'pickup'
    | 'delivery'
    | 'report'
    | 'exchange'
    | 'exchangeDelivery'
    | 'exchangePickup'
    | 'assignment'
    | 'created'
    | 'fix'
    | 'retire'
    | 'reactivate'
    | 'custom'
    | 'inventory'

  orderId?: string
  content: string
  itemId: string
}
export type ItemHistoryType = ItemHistoryBase & BaseType

type Type = ItemHistoryType
export class ServiceItemHistoryClass extends FirebaseGenericService<
  Type & { id: string } //*??? why this is necessary?
> {
  async addEntry({
    storeId,
    itemId,
    entry
  }: {
    storeId: string
    itemId: string
    entry: Partial<Type>
  }) {
    return await this.createRefItem({
      collectionRef: collection(
        db,
        COLLECTION,
        storeId,
        SUB_COLLECTION,
        itemId,
        SUB_COLLECTION_2
      ),
      item: entry
    })
  }

  async listenLastEntries({
    storeId,
    itemId,
    callback,
    count = 5,
    type
  }: {
    storeId: string
    itemId: string
    callback: (entries: Type[]) => void
    count?: number
    type?: Type['type']
  }) {
    let filters: QueryConstraint[] = [
      limit(count),
      orderBy('createdAt', 'desc')
    ]
    if (!!type) {
      filters.push(where('type', '==', type))
    }
    const collectionRef = collection(
      db,
      COLLECTION,
      storeId,
      SUB_COLLECTION,
      itemId,
      SUB_COLLECTION_2
    )
    return this.listenRefItems({
      cb: callback,
      collectionRef,
      filters
    })
  }

  async getLastEntries({
    count = 5,
    storeId,
    itemId,
    type
  }: {
    count?: number
    storeId: string
    itemId: string
    type?: Type['type']
  }): Promise<Type[]> {
    let filters: QueryConstraint[] = [
      limit(count),
      orderBy('createdAt', 'desc')
    ]
    if (!!type) {
      filters.push(where('type', '==', type))
    }
    const collectionRef = collection(
      db,
      COLLECTION,
      storeId,
      SUB_COLLECTION,
      itemId,
      SUB_COLLECTION_2
    )
    return await this.getRefItems({
      collectionRef,
      filters
    })
  }
  async getLastFixEntry({ itemId, storeId }) {
    const entries = await this.getRefItems({
      collectionRef: collection(
        db,
        COLLECTION,
        storeId,
        SUB_COLLECTION,
        itemId,
        SUB_COLLECTION_2
      ),
      filters: [
        limit(1),
        orderBy('createdAt', 'desc'),
        where('type', '==', 'fix')
      ]
    })
    return entries[0]
  }

  async getWorkshopDateMovements({
    fromDate,
    toDate,
    storeId,
    items
  }: {
    fromDate: Date
    toDate: Date
    storeId: string
    items: Partial<ItemType>[]
  }) {
    let filters: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      where('createdAt', '>=', fromDate),
      where('createdAt', '<=', toDate)
    ]

    const itemsIds = items?.map(({ id }) => id)
    const itemsHistory = itemsIds.map(async (itemId) => {
      const collectionRef = collection(
        db,
        COLLECTION,
        storeId,
        SUB_COLLECTION,
        itemId,
        SUB_COLLECTION_2
      )
      const res = await this.getRefItems({ collectionRef, filters })
      const itemsEntries = res.map((item: ItemHistoryType) => ({
        ...item,
        itemId
      }))
      return itemsEntries
    })
    const historyEntries = await Promise.all(itemsHistory).then(
      (res) => res.flat() as ItemHistoryType[]
    )
    return historyEntries.map((entry) => {
      const itemData = items.find(({ id }) => id === entry.itemId)
      return { ...entry, itemNumber: itemData?.number }
    })
  }

  async getItemsMovements({
    date,
    storeId,
    type
  }: //items
  {
    date: Date
    storeId: string
    type?: Type['type']
    //items: string[]
  }): Promise<Type[]> {
    let filters: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      where('createdAt', '>=', startDate(date)),
      where('createdAt', '<=', endDate(date))
    ]
    if (!!type) {
      filters.push(where('type', '==', type))
    }
    const items = await ServiceStoreItems.getAll(
      { storeId },
      { justRefs: true }
    ).then((res) => {
      return res.map(({ id }) => id)
    })
    const itemsHistory = items.map(async (itemId) => {
      const collectionRef = collection(
        db,
        COLLECTION,
        storeId,
        SUB_COLLECTION,
        itemId,
        SUB_COLLECTION_2
      )
      const res = await this.getRefItems({ collectionRef, filters })
      const itemsEntries = res.map((item: ItemHistoryType) => ({
        ...item,
        itemId
      }))
      return itemsEntries
    })
    const historyEntries = await Promise.all(itemsHistory).then(
      (res) => res.flat() as ItemHistoryType[]
    )
    return historyEntries
  }
}
export const ServiceItemHistory = new ServiceItemHistoryClass('stores')
