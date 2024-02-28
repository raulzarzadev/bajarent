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
}

type PaymentType = PaymentBase & BaseType

export enum payment_methods {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer'
}
export default PaymentType
