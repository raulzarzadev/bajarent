import { where } from 'firebase/firestore'
import StaffType from '../types/StaffType'
import { FirebaseGenericService } from './genericService'

type Type = StaffType
class ServiceStaffClass extends FirebaseGenericService<Type> {
  constructor() {
    super('staff')
  }

  async addStaffToStore(storeId: string, staff: Partial<StaffType>) {
    return await this.create({ ...staff, storeId })
  }

  async removeStaffFromStore(storeId: string, staffId: string) {
    return this.delete(staffId)
  }

  storeStaff(storeId: string, cb: CallableFunction): Promise<void> {
    return super.listenMany([where('storeId', '==', storeId)], cb)
  }

  async getByStore(storeId: string) {
    // get all staff that has storeId
    const staff = await this.findMany([where('storeId', '==', storeId)])
    return staff
  }

  async getStaffPositions(userId: string) {
    // get all staff position that has userId have
    const positions = await this.getItems([where('userId', '==', userId)])
    return positions
  }
}

export const ServiceStaff = new ServiceStaffClass()
