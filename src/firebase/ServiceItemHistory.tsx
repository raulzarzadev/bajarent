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

const COLLECTION = 'stores'
const SUB_COLLECTION = 'items'
const SUB_COLLECTION_2 = 'history'
export type ItemHistoryBase = {
  type:
    | 'pickup'
    | 'delivery'
    | 'report'
    | 'exchange'
    | 'assignment'
    | 'created'
    | 'fix'
  orderId?: string
  content: string
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
    return await this.getRefItems({
      collectionRef: collection(
        db,
        COLLECTION,
        storeId,
        SUB_COLLECTION,
        itemId,
        SUB_COLLECTION_2
      ),
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

  // async addEntry({
  //   storeId,
  //   itemId,
  //   entry
  // }: {
  //   storeId: string
  //   itemId: string
  //   entry: any
  // }) {
  //   const historyRef = collection(
  //     db,
  //     COLLECTION,
  //     storeId,
  //     SUB_COLLECTION,
  //     itemId,
  //     SUB_COLLECTION_2
  //   )
  // }
}
export const ServiceItemHistory = new ServiceItemHistoryClass('stores')
