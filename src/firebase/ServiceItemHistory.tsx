import { collection, limit, orderBy } from 'firebase/firestore'
import { db } from './main'
import { FirebaseGenericService } from './genericService'

const COLLECTION = 'stores'
const SUB_COLLECTION = 'items'
const SUB_COLLECTION_2 = 'history'
export type ItemHistoryType = {
  id: string
  type: 'pickup' | 'delivery' | 'report' | 'exchange' | 'assignment' | 'created'
  orderId?: string
}
type Type = ItemHistoryType
export class ServiceItemHistoryClass extends FirebaseGenericService<Type> {
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

  async getLastEntries({ count = 5, storeId, itemId }): Promise<Type[]> {
    return await this.getRefItems({
      collectionRef: collection(
        db,
        COLLECTION,
        storeId,
        SUB_COLLECTION,
        itemId,
        SUB_COLLECTION_2
      ),
      filters: [limit(count), orderBy('createdAt', 'desc')]
    })
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
