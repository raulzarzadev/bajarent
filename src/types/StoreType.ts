import { FieldValue } from 'firebase/firestore'
import { FormOrderFields } from '../components/FormOrder'
import BaseType from './BaseType'
import ItemType from './ItemType'
import { TypeOrderKey, order_type } from './OrderType'
import { SectionType } from './SectionType'
import StaffType from './StaffType'
export type StoreItems = {
  [key: string]: Partial<ItemType>
}

export type BaseStoreType = {
  name: string
  description?: string
  staff?: StaffType[]
  sections?: SectionType[]
  allowSections?: boolean
  allowStaff?: boolean
  img?: string
  marketVisible?: boolean
  address?: string
  schedule?: string
  currentFolio?: FieldValue
  currentEco?: FieldValue
  location?: string
  orderTypes?: Record<TypeOrderKey, boolean>
  orderFields?: Record<TypeOrderKey, Record<FormOrderFields, boolean>>

  /**
   * @deprecated use bankAccounts instead
   */
  bankInfo?: {
    bank: string
    clabe: string
  }[]
  /**
   * @deprecated use bankAccounts instead
   */
  phone?: string
  /**
   * @deprecated use bankAccounts instead
   */
  mobile?: string
  //* multi items
  bankAccounts?: MultiFields[]
  contacts?: MultiFields[]
  socialMedia?: MultiFields[]

  accountHolder?: string
  items?: StoreItems

  chatbot?: {
    id?: string
    apiKey?: string
    hostNumber?: string
    enabled?: boolean
    config?: Record<ChatBotConfigs, boolean>
  }
}

// export enum store_bot_configs {
//   includeSender = 'Incluir remitente',

// }
export const bot_configs_message_ops = {
  includeSender: 'Incluir remitente'
}
export const bot_configs_order_flow = {
  sendDelivered: 'Orden entregada',
  sendPickedUp: 'Orden recogida',
  sendRenewed: 'Orden renovada',
  sendAuthorizedOrder: 'Orden autorizada',
  sendStatusOrder: 'Estado de orden',
  sendExpireOrder: 'Vencimiento de orden',
  sendNewWebOrder: 'Orden web',
  sendNewStoreOrder: 'Orden de tienda'
}
export const bot_configs = {
  ...bot_configs_message_ops,
  ...bot_configs_order_flow
}

export type StoreBotConfigsType = keyof typeof bot_configs

export type ChatBotConfigs = keyof typeof bot_configs

export type MultiFields = {
  type: string
  label: string
  value: string
}

type StoreType = BaseType & BaseStoreType

export default StoreType
