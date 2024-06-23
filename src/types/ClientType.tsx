import { Timestamp } from 'firebase/firestore'
import BaseType from './BaseType'

export type ClientBase = {
  id?: string
  name: string
  phone?: string
  neighborhood?: string
  address?: string
  imageID?: string
  imageHouse?: string
  isActive?: boolean
  isReported?: boolean
  isBlocked?: boolean
  createdBy?: string
  createdAt?: Date | Timestamp
}
export type ClientType = ClientBase & BaseType
