import { deleteField, where } from 'firebase/firestore'
import StaffType from '../types/StaffType'
import { FirebaseGenericService } from './genericService'
import { ServiceUsers } from './ServiceUser'

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

    const withUserData = await Promise.all(
      staff.map(async (s) => {
        const user = await ServiceUsers.get(s.userId)
        return {
          ...s,
          name: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          image: user?.image || '',
          user
        }
      })
    )

    return withUserData
  }

  async getStaffPositions(userId: string) {
    // get all staff position that has userId have
    const positions = await this.getItems([where('userId', '==', userId)])
    return positions
  }

  async deleteOldPermissions(staffId: string) {
    return await this.update(staffId, {
      canAssignOrder: deleteField(),
      canAuthorizeOrder: deleteField(),
      canCancelOrder: deleteField(),
      canCreateOrder: deleteField(),
      canDeleteOrder: deleteField(),
      canDeliveryOrder: deleteField(),
      canEditOrder: deleteField(),
      canPickupOrder: deleteField(),
      canRenewOrder: deleteField(),
      canRepairOrder: deleteField(),
      canViewMyOrders: deleteField(),
      canViewOrders: deleteField(),
      isAdmin: deleteField()
    })
  }
}

/**
 * @deprecated use ServiceStore.updateStaff from src/hooks/useShop
 */
export const ServiceStaff = new ServiceStaffClass()
