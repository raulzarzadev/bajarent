import BaseType from './BaseType'
import { RentItem } from './RentItem'
import StoreType from './StoreType'
import { CommentType } from './CommentType'
import PaymentType from './PaymentType'
import { TimePriceType } from './PriceType'
import { ExtendReason } from '../firebase/ServiceOrders'
import UserType from './UserType'

type OrderBase = {
  colorLabel?: string
  type: TypeOfOrderType
  clientId: string
  note: string

  folio: number
  status: OrderStatus

  storeId: StoreType['id']

  firstName: string
  lastName: string
  fullName: string

  email: string
  phone: string

  imageID: string
  imageHouse: string

  street?: string
  betweenStreets?: string
  neighborhood?: string
  location?: string
  /**
   * @deprecated use references instead
   */
  indications?: string
  references?: string
  address?: string

  scheduledAt: Date

  authorizedAt: Date
  authorizedBy: string

  deliveredAt: Date
  deliveredBy: string
  deliveredByStaff: string

  pickedUpAt?: Date
  pickedUpBy?: string
  pickedUpByStaff?: string

  items: RentItem[]
  item: RentItem
  expireAt?: Date | null
  isExpired?: boolean

  expiresToday?: boolean
  expiresTomorrow?: boolean

  comments: CommentType[]

  hasNotSolvedReports?: boolean
  hasImportantComment?: boolean
  assignToSection?: string
  assignToSectionName?: string
  assignToStaff?: string

  /**
   * @deprecated use assignToStaff instead
   */
  assignToPosition?: string
  /**
   * @deprecated use assignToStaff instead
   */
  assignToName?: string
  /**
   * @deprecated use assignToStaff instead
   */
  assignTo: string

  renewedAt: Date
  renewedBy: string
  renewedFrom: OrderType['id']
  renewedTo: OrderType['id']

  hasDelivered?: boolean

  //* to repair orders
  description?: string
  itemBrand?: string
  itemSerial?: string

  repairedAt?: Date
  repairedBy?: string
  repairedByStaff?: string

  repairingBy?: string
  repairingAt?: Date

  repairTotal?: number
  repairInfo?: string
  quoteBy?: string

  quote?: OrderQuoteType
  startRepair?: boolean

  cancelledAt?: Date
  cancelledBy?: string
  cancelledReason?: string

  payments: PaymentType[]

  priority?: number

  sheetRow?: string //* for google sheet row and lavarenta format

  extensions?: Record<
    string,
    {
      id: string
      time: TimePriceType
      reason: ExtendReason
      startAt: Date
      expireAt: Date
      createdAt: Date
      createdBy: UserType['id']
    }
  >

  /* ******************************************** 
             Extend expire feature               
   *******************************************rz */
  extendReason?: string
  extendTime?: TimePriceType

  /* ******************************************** 
             STATUSES FOR ORDERS               
   *******************************************rz */
  statuses?: boolean
  isDelivered?: boolean

  /**
   * @deprecated use hasNotSolvedReports instead
   */
  isReported?: boolean
  isRenewed?: boolean
  isCancelled?: boolean
  isRepairing?: boolean
  isDeleted?: boolean
  isExtended?: boolean
}

export type OrderQuoteType = {
  description?: string
  amount?: number
}

export enum order_status {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REPORTED = 'REPORTED',
  PICKUP = 'PICKUP',
  // ? Should change order status to DELIVERED and add a extra prop called isExpired instead change the status
  EXPIRED = 'EXPIRED',
  RENEWED = 'RENEWED',
  REPAIRING = 'REPAIRING',
  REPAIRED = 'REPAIRED',
  REPAIR_DELIVERED = 'REPAIR_DELIVERED',
  PICKED_UP = 'PICKED_UP',
  EXPIRE_TODAY = 'EXPIRE_TODAY',
  EXPIRED_TOMORROW = 'EXPIRED_TOMORROW'
}

/**
 * @deprecated use TypeOrder instead
 */
export enum order_type {
  RENT = 'RENT',
  SALE = 'SALE',
  REPAIR = 'REPAIR',
  STORE_RENT = 'STORE_RENT',
  DELIVERY_RENT = 'DELIVERY_RENT',
  DELIVERY_SALE = 'DELIVERY_SALE',
  MULTI_RENT = 'MULTI_RENT'
}
export const orders_should_expire = [
  order_type.RENT,
  order_type.STORE_RENT,
  order_type.DELIVERY_RENT,
  order_type.MULTI_RENT
]
export type TypeOfOrderType = order_type
export type OrderStatus = order_status

type OrderType = OrderBase & BaseType

export const ORDER_STATUS_SOLVED = [
  order_status.CANCELLED,
  order_status.REPAIR_DELIVERED,
  order_status.DELIVERED,
  order_status.PICKUP,
  order_status.RENEWED
]

export const ORDER_STATUS_UNSOLVED = Object.keys(order_status).filter(
  (status) => !ORDER_STATUS_SOLVED.includes(status as any)
)

export default OrderType

/* ********************************************
 *Start using typeOrder instead of order_type reduce options to select order form
 *******************************************rz */

export enum TypeOrder {
  RENT = 'RENT',
  SALE = 'SALE',
  REPAIR = 'REPAIR'
}

export const IconOrderType = {
  [TypeOrder.RENT]: '📦',
  [TypeOrder.SALE]: '💰',
  [TypeOrder.REPAIR]: '🔧'
}

// export const IconOrderType = {
//   [TypeOrder.RENT]: Icon({ icon: 'rent' }),
//   [TypeOrder.SALE]: Icon({ icon: 'money' }),
//   [TypeOrder.REPAIR]: Icon({ icon: 'repair' })
// }

export const TypeOrderKeys = Object.keys(TypeOrder).filter((a) =>
  isNaN(Number(a))
)

export type TypeOrderKey = keyof typeof TypeOrder
