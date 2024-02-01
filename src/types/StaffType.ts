import BaseType from './BaseType'
import StoreType from './StoreType'

export type BaseStaffType = {
  storeId: string
  position?: string
  userId: string

  isAdmin?: boolean

  //* this fields are provided by the user data
  name: string
  email?: string
  phone?: string

  store?: Partial<StoreType>
}

type StaffType = BaseType & BaseStaffType

export type CreateStaffType = Partial<BaseStaffType>

export default StaffType
