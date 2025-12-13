import { getAuth } from 'firebase/auth'
import { where } from 'firebase/firestore'
import { createUUID } from '../libs/createId'
import type StaffType from '../types/StaffType'
import type StoreType from '../types/StoreType'
import { FirebaseGenericService } from './genericService'
export class ServiceStoresClass extends FirebaseGenericService<StoreType> {
  constructor() {
    super('stores')
  }

  async create(store: Partial<StoreType>) {
    const currentUser = getAuth().currentUser
    const userId = currentUser?.uid
    const ownerStaff = {
      id: createUUID(),
      userId,
      roles: { admin: true },
      permissions: { isOwner: true }
    }
    return super.create({
      ...store,
      staffUserIds: userId ? [userId] : [],
      staff: userId ? [ownerStaff as StaffType] : []
    })
  }

  async getStoresByUserId(userId: string) {
    return this.getItems([where('createdBy', '==', userId)])
  }

  async getWhereUserIsStaff(userId: string) {
    return this.getItems([where('staffUserIds', 'array-contains', userId)])
  }

  async userStores(userId: string) {
    const asStaff = await this.getWhereUserIsStaff(userId)
    const asOwner = await this.getStoresByUserId(userId)
    const uniqueStores = new Map()
    asStaff.forEach((s) => {
      uniqueStores.set(s.id, s)
    })
    asOwner.forEach((s) => {
      uniqueStores.set(s.id, s)
    })

    return Array.from(uniqueStores.values())
  }

  async updateStaff({
    storeId,
    staffId,
    staff
  }: {
    storeId: string
    staffId: string
    staff: Partial<StaffType>
  }) {
    const store = await this.get(storeId)
    if (!store) throw new Error('Store not found')
    const currentStaff = store.staff || []
    const employee = currentStaff.find((s) => s.id === staffId)
    if (!employee) throw new Error('Staff member not found in store')
    const updatedStaff = currentStaff.map((s) =>
      s.id === staffId ? { ...s, ...staff } : s
    )

    return this.update(storeId, { staff: updatedStaff })
  }

  async removeOldPermissions({
    storeId,
    staffId
  }: {
    storeId: string
    staffId: string
  }) {
    const store = await this.get(storeId)
    if (!store) throw new Error('Store not found')
    const currentStaff = store.staff || []

    const permissionsToRemove = [
      'canAssignOrder',
      'canAuthorizeOrder',
      'canCancelOrder',
      'canCreateOrder',
      'canDeleteOrder',
      'canDeliveryOrder',
      'canEditOrder',
      'canPickupOrder',
      'canRenewOrder',
      'canRepairOrder',
      'canViewMyOrders',
      'canViewOrders',
      'isAdmin'
    ]

    const updatedStaff = currentStaff.map((s) => {
      if (s.id === staffId) {
        const newS = { ...s }
        permissionsToRemove.forEach((p) => {
          delete newS[p]
        })
        return newS
      }
      return s
    })

    return this.update(storeId, { staff: updatedStaff })
  }

  async removeStaff({
    storeId,
    staffId
  }: {
    storeId: string
    staffId: string
  }) {
    const store = await this.get(storeId)
    if (!store) throw new Error('Store not found')
    const currentStaff = store.staff || []
    const staffToRemove = currentStaff.find((s) => s.id === staffId)
    const userIdToRemove = staffToRemove?.userId

    const updatedStaff = currentStaff.filter((s) => s.id !== staffId)

    let updatedStaffUserIds = store.staffUserIds || []
    if (userIdToRemove) {
      updatedStaffUserIds = updatedStaffUserIds.filter(
        (id) => id !== userIdToRemove
      )
    }
    return this.update(storeId, {
      staff: updatedStaff,
      staffUserIds: updatedStaffUserIds
    })
  }

  async addStaff({
    storeId,
    staff
  }: {
    storeId: string
    staff: Partial<StaffType>
  }) {
    const store = await this.get(storeId)
    if (!store) throw new Error('Store not found')

    const currentStaff = store.staff || []
    const currentStaffUserIds = store.staffUserIds || []

    staff.id = createUUID()
    const updatedStaff = [...currentStaff, staff as StaffType]

    const userId = staff.userId
    let updatedStaffUserIds = currentStaffUserIds
    if (userId && !currentStaffUserIds.includes(userId)) {
      updatedStaffUserIds = [...currentStaffUserIds, userId]
    }
    return this.update(storeId, {
      staff: updatedStaff,
      staffUserIds: updatedStaffUserIds
    })
  }

  /**
   * Add or remove staff to section, by updating each staff members assignedSections
   * Put this section in each assignedSection staff
   * @param param0 storeId, sectionId staffIds[]
   * @returns Promise<void>
   */
  async setStaffToSection({
    storeId,
    sectionId,
    staffIds
  }: {
    storeId: string
    sectionId: string
    staffIds: string[]
  }) {
    const shop = await this.get(storeId)
    if (!shop) throw new Error('Store not found')
    const shopStaff = shop.staff || []

    const staffUpdated = shopStaff.map((s) => {
      if (staffIds.includes(s.id)) {
        return {
          ...s,
          sectionsAssigned: s?.sectionsAssigned
            ? Array.from(new Set([...s.sectionsAssigned, sectionId]))
            : [sectionId]
        }
      } else {
        return {
          ...s,
          sectionsAssigned: s?.sectionsAssigned
            ? s?.sectionsAssigned.filter((secId) => secId !== sectionId)
            : []
        }
      }
    })
    return this.update(storeId, { staff: staffUpdated })
  }

  async addStaffToSection({
    storeId,
    sectionId,
    staffIds
  }: {
    storeId: string
    sectionId: string
    staffIds: string[]
  }) {
    const store = await this.get(storeId)
    if (!store) throw new Error('Store not found')

    const currentStaff = store.staff || []
    const updatedStaff = currentStaff.map((s) => {
      if (staffIds.includes(s.id)) {
        const sectionsAssigned = s.sectionsAssigned || []
        if (!sectionsAssigned.includes(sectionId)) {
          return {
            ...s,
            sectionsAssigned: [...sectionsAssigned, sectionId]
          }
        }
      }
      return s
    })
    return this.update(storeId, { staff: updatedStaff })
  }

  async updateStaffSectionsAssigned({
    storeId,
    staffId,
    sectionsAssigned
  }: {
    storeId: string
    staffId: string
    sectionsAssigned: string[]
  }) {
    const store = await this.get(storeId)
    if (!store) throw new Error('Store not found')
    const currentStaff = store.staff || []
    const updatedStaff = currentStaff.map((s) =>
      s.id === staffId ? { ...s, sectionsAssigned } : s
    )
    return this.update(storeId, { staff: updatedStaff })
  }

  // Agrega tus métodos aquí
  async customMethod() {
    // Implementa tu método personalizado
  }
}

export const nextItemNumber = ({
  currentNumber = '0000'
}: {
  currentNumber: string
}) => {
  const newValue = parseInt(currentNumber) + 1
  return newValue.toString().padStart(5, '0')
}

export const ServiceStores = new ServiceStoresClass()
