import BaseType from './BaseType'

export type BaseStaffType = {
  storeId: string
  position?: string
  userId: string

  //* this fields are provided by the user data
  name: string
  email?: string
  phone?: string
}

type StaffType = BaseType & BaseStaffType

export type CreateStaffType = Partial<BaseStaffType>

export default StaffType
