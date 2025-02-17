import { serverTimestamp, where } from 'firebase/firestore'
import { GetItemsOps } from '../../firebase/firebase.CRUD'
import { FirebaseGenericService } from '../../firebase/genericService'
import { CurrentWorkType, NewWorkUpdate } from './CurrentWorkType'
import { startDate } from '../../libs/utils-date'

class ServiceCurrentWorkClass extends FirebaseGenericService<CurrentWorkType> {
  constructor() {
    super('currentWork_v2')
  }
  async getByStore(storeId: string, ops?: GetItemsOps) {
    return this.getItems([where('storeId', '==', storeId)], ops)
  }

  async getByDate({ date, storeId }: { date: Date; storeId: string }) {
    return this.get(currentWorkId(storeId, date))
  }
  getTodayWork(storeId: string) {
    return this.get(currentWorkId(storeId))
  }

  async listenTodayByStore(
    storeId: string,
    callback: (data: CurrentWorkType[]) => void
  ) {
    return this.listen(currentWorkId(storeId), callback)
  }
  async addWork({
    storeId,
    work,
    userId
  }: {
    storeId: string
    work: NewWorkUpdate
    userId: string
  }) {
    const doc = await this.getTodayWork(storeId)
    const updateId = new Date().toISOString()
    if (doc) {
      return await this.update(doc.id, {
        updates: {
          ...doc.updates,
          [updateId]: {
            ...work,
            createdBy: userId,
            createdAt: serverTimestamp()
          }
        }
      }).then((res) => {
        return { ...work, id: updateId }
      })
    } else {
      return await this.set(currentWorkId(storeId), {
        storeId,
        date: startDate(new Date()),
        updates: {
          [updateId]: {
            ...work,
            createdBy: userId,
            createdAt: serverTimestamp()
          }
        }
      }).then((res) => {
        return { ...work, id: updateId }
      })
    }
  }
}

export const ServiceCurrentWork = new ServiceCurrentWorkClass()

const currentWorkId = (storeId: string, date: Date = new Date()) =>
  `${storeId}_${date.toISOString().split('T')[0]}`
