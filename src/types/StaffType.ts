import BaseType from './BaseType'

export type BaseStaffType = {
  name: string
  storeId: string
  phone?: string
  email?: string
}

type StaffType = BaseType & BaseStaffType

export default StaffType
