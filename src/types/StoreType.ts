import type { FieldValue } from 'firebase/firestore'
import type { FormOrderFields } from '../components/FormOrder'
import type BaseType from './BaseType'
import type ItemType from './ItemType'
import type { TypeOrderKey } from './OrderType'
import type { SectionType } from './SectionType'
import type StaffType from './StaffType'
export type StoreItems = {
  [key: string]: Partial<ItemType>
}

export type BaseStoreType = {
  name: string
  description?: string
  staff?: StaffType[]
  staffUserIds?: string[]
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
  orderTypesContract?: Record<TypeOrderKey, ContractType>
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

  preferences?: {
    itemIdentifier?: 'serialNumber' | 'economicNumber' | 'sku'
  }

  chatbot?: {
    enabledAutoWs: any
    autoWsApiKey?: string
    autoWsId?: string
    sender: 'bajarent' | 'auto-ws'
    id?: string
    apiKey?: string
    hostNumber?: string
    enabled?: boolean
    config?: Record<ChatBotConfigs, boolean>
  }
}
export type ContractType = {
  version: string
  url: string
}

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
