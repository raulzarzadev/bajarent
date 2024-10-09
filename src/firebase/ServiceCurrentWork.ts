import { where } from 'firebase/firestore'
import { ServiceStores } from './ServiceStore'
import { endDate, startDate } from '../libs/utils-date'
const SUB_COLLECTION = 'currentWork'
export class ServiceCurrentWorkClass {
  add({ storeId, currentWork }) {
    return ServiceStores.createInSubCollection({
      parentId: storeId,
      newItem: currentWork,
      subCollectionName: SUB_COLLECTION
    })
  }
  getById({ storeId, currentWorkId }) {
    return ServiceStores.getItemInCollection({
      parentId: storeId,
      itemId: currentWorkId,
      subCollection: SUB_COLLECTION
    })
  }
  getBetweenDates({
    storeId,
    fromDate,
    toDate
  }: {
    storeId: string
    fromDate: Date
    toDate: Date
  }) {
    return ServiceStores.getItemsInCollection({
      parentId: storeId,
      subCollection: SUB_COLLECTION,
      filters: [
        where('createdAt', '>=', fromDate),
        where('createdAt', '<=', toDate)
      ]
    })
  }
}
export const ServiceCurrentWork = new ServiceCurrentWorkClass()
