import BaseType from './BaseType'
import { CategoryType, RentItem } from './RentItem'
import StoreType from './StoreType'
import { CommentType } from './CommentType'
import PaymentType from './PaymentType'
import { TimePriceType } from './PriceType'
import { ExtendReason } from '../firebase/ServiceOrders'
import UserType from './UserType'
import { FieldValue } from 'firebase/firestore'
import CoordsType from './CoordsType'
import { WorkshopFlow, WorkshopStatus } from './WorkshopType'
import { IconName } from '../components/Icon'
import {
  InputContractSignatureProps,
  InputContractSignatureValues
} from '../components/InputContractSignature'

export type ContactType = {
  name: string
  phone: string
  id?: string
  isOriginal?: boolean
  isFavorite?: boolean
}

export enum repair_order_types {
  REPAIR_WARRANTY = 'REPAIR_WARRANTY',
  SALE_WARRANTY = 'SALE_WARRANTY',
  CLIENT_NEW = 'CLIENT_NEW',
  CLIENT_FREQUENT = 'CLIENT_FREQUENT',
  CLIENT_VIP = 'CLIENT_VIP'
}

export type RepairOrderType = keyof typeof repair_order_types

export type OrderBase = {
  colorLabel?: string
  type: TypeOfOrderType

  marketOrder?: boolean // * this option us true when the order is created from the web market
  pendingMarketOrder?: boolean //

  // * this option is marked when order wasn't fund in the system. Should disabled order actions
  isConsolidated?: boolean
  /**
   * @deprecated use customerId instead
   */
  clientId: string
  excludeCustomer?: boolean
  customerId: string
  note: string

  repairType?: RepairOrderType

  folio: number
  status: OrderStatus

  storeId: StoreType['id']

  firstName: string
  lastName: string
  fullName: string

  customerName?: string //* this is modified when customer is updated

  signature?: string

  email: string
  phone: string

  contacts?: ContactType[] | FieldValue

  imageID: string
  imageHouse: string

  street?: string
  betweenStreets?: string
  neighborhood?: string
  location?: string
  coords?: CoordsType

  sentMessages: SentMessage[]
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

  workshopStatus?: WorkshopStatus
  workshopFlow?: WorkshopFlow

  expiresToday?: boolean
  expiresTomorrow?: boolean
  expiresOnMonday?: boolean

  comments: CommentType[]

  hasNotSolvedReports?: boolean
  hasImportantComment?: boolean
  assignToSection?: string
  assignToSectionName?: string
  assignToStaff?: string

  contractSignature?: InputContractSignatureValues

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

  itemBrand?: string
  itemSerial?: string

  repairedAt?: Date
  repairedBy?: string
  repairedByStaff?: string

  repairingBy?: string
  repairingAt?: Date
  repairTotal?: number

  //* to repair orders
  /**
   * @deprecated use failDescription instead
   */
  description?: string
  /**
   * @deprecated use failDescription instead
   */
  repairInfo?: string

  failDescription?: string

  quoteBy?: string

  quotes?: FieldValue | OrderQuoteType[]
  quote?: OrderQuoteType
  startRepair?: boolean

  cancelledAt?: Date
  cancelledBy?: string
  cancelledReason?: string

  payments: PaymentType[]

  priority?: number

  sheetRow?: string //* for google sheet row and lavarenta format

  extensions?: Record<string, OrderExtensionType>

  /* ******************************************** 
             QUICK ACTIONS               
   *******************************************rz */
  markedToCollect?: boolean
  markedToCharge?: boolean

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
  isAuthorized?: boolean

  /**
   * @deprecated use hasNotSolvedReports instead
   */
  isReported?: boolean
  isRenewed?: boolean
  isCancelled?: boolean
  isRepairing?: boolean
  isDeleted?: boolean
  isExtended?: boolean
  [key: string]: any
}
export type OrderExtensionType = {
  id: string
  time: TimePriceType
  reason: ExtendReason
  startAt: Date
  expireAt: Date
  createdAt: Date
  createdBy: UserType['id']
  content?: string
  orderId?: string
}
export type OrderQuoteType = {
  description?: string
  amount?: number
  id?: string
  doneAt?: Date | null
  doneBy?: string | null
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

export type SentMessage = {
  number: string
  message: string
  sentAt: Date
  sentBy: string
}

// /**
//  * @deprecated use TypeOrder instead
//  */
export enum order_type {
  RENT = 'RENT',
  SALE = 'SALE',
  REPAIR = 'REPAIR',
  /**
   * @deprecated use RENT instead
   */
  STORE_RENT = 'STORE_RENT',
  /**
   * @deprecated use RENT instead
   */
  DELIVERY_RENT = 'DELIVERY_RENT',
  /**
   * @deprecated use SALE instead
   */
  DELIVERY_SALE = 'DELIVERY_SALE',
  /**
   * @deprecated use RENT instead
   */
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

type OrderType = OrderBase &
  BaseType & {
    paidAt: Date
    paidBy: string
  }

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

/**
 * @deprecated use order_type instead
 */
export enum TypeOrder {
  RENT = 'RENT',
  SALE = 'SALE',
  REPAIR = 'REPAIR'
}
export type TypeOrderType = keyof typeof TypeOrder

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

export type SaleOrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  category: CategoryType['id']
  serial: string
  categoryName?: string
}

export const typeOrderIcon = (type: OrderType['type']): IconName => {
  const icons = {
    [order_type.RENT]: 'rent',
    [order_type.SALE]: 'money',
    [order_type.REPAIR]: 'wrench'
  }
  return icons[type]
}
