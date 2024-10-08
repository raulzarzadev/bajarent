import { RetirementType } from '../components/FormRetirement'
import BaseType from './BaseType'

export type PaymentBase = {
  amount: number
  date: Date
  method: 'cash' | 'card' | 'transfer'
  storeId: string
  orderId: string
  reference?: string
  clientName?: string
  orderFolio?: number
  orderName?: string
  orderNote?: string
  canceled?: boolean
  canceledBy?: string
  canceledAt?: Date
  canceledReason?: string

  verified?: boolean
  verifiedAt?: Date
  verifiedBy?: string

  image?: string

  // For retirements
  isRetirement?: boolean
  description?: string
  employeeId?: string
  type?: RetirementType['type']
  sectionId?: string
}

type PaymentType = PaymentBase & BaseType

export enum payment_methods {
  TRANSFER = 'transfer',
  CASH = 'cash',
  CARD = 'card'
}
export default PaymentType
