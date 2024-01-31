import { arrayRemove, arrayUnion, where } from 'firebase/firestore'
import StaffType from '../types/StaffType'
import { FirebaseGenericService } from './genericService'
import { ServiceStores } from './ServiceStore'

type Type = StaffType
class ServiceStaffClass extends FirebaseGenericService<Type> {
  constructor() {
    super('staff')
  }

  async addStaffToStore(storeId: string, staff: Partial<StaffType>) {
    // create staff
    const res = await this.create({ ...staff, storeId })

    if (res.ok) {
      // add to store
      // @ts-ignore
      ServiceStores.update(storeId, { staffIds: arrayUnion(res.res.id) })
    }
  }

  async removeStaffFromStore(storeId: string, staffId: string) {
    // remove from store
    // @ts-ignore
    ServiceStores.update(storeId, { staffIds: arrayRemove(staffId) })
    // remove staff
    this.delete(staffId)
  }

  storeStaff(storeId: string, cb: CallableFunction): Promise<void> {
    return super.listenMany([where('storeId', '==', storeId)], cb)
  }
}

export const ServiceStaff = new ServiceStaffClass()
