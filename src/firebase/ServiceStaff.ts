import { where } from 'firebase/firestore'
import StaffType from '../types/StaffType'
import { FirebaseGenericService } from './genericService'

type Type = StaffType
class ServiceStaffClass extends FirebaseGenericService<Type> {
  constructor() {
    super('staff')
  }
  storeStaff(storeId: string, cb: CallableFunction): Promise<void> {
    return super.listenMany([where('storeId', '==', storeId)], cb)
  }
}

export const ServiceStaff = new ServiceStaffClass()
