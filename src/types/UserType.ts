import BaseType from './BaseType'

export type UserBase = {
  name: string
  phone: string
  email: string
  image?: string
  rol: 'admin' | 'user'
  super_user?: boolean
}

type UserType = BaseType & UserBase

export default UserType
