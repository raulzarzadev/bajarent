import { View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import { ReactNode } from 'react'

const ORDER_FIELDS = [
  'type',
  'fullName',
  'phone',
  'scheduledAt',
  'address',
  'location',
  'neighborhood',
  'references',
  'repairDescription', // Field name is 'description' in the form
  'itemBrand',
  'itemSerial',
  'imageID',
  'imageHouse',
  'assignIt',

  'hasDelivered',
  'sheetRow',
  'note',

  'selectItems',

  //Repairs
  'quote',
  'startRepair'
  // 'folio'
] as const
export type OrderFields = (typeof ORDER_FIELDS)[number]

const RENT_ORDER_FIELDS: OrderFields[] = [
  //* business
  'sheetRow',
  'note',
  //* mandatory
  'fullName',
  'phone',
  //* location
  'address',
  'location',
  'neighborhood',
  'references',
  'imageID',
  'imageHouse',
  //* optional
  'assignIt',
  'hasDelivered',
  'scheduledAt',
  //*items
  'selectItems'
]
const REPAIR_ORDER_FIELDS: OrderFields[] = [
  //* business
  'sheetRow',
  'note',
  //* mandatory
  'fullName',
  'phone',
  'address',
  'location',
  'neighborhood',
  'references',
  'imageID',
  'assignIt',
  //* repair order type
  'quote',
  'startRepair',
  'scheduledAt'
]
const SALE_ORDER_FIELDS: OrderFields[] = [
  'note',
  'fullName',
  'phone',
  'scheduledAt',
  'address',
  'location',
  'neighborhood',
  'references',
  'imageID',
  'imageHouse',
  'assignIt',
  'selectItems'
]

function FormOrder({}) {
  const ALL_FIELDS: Record<OrderFields, ReactNode> = {
    type: '',
    fullName: '',
    phone: '',
    scheduledAt: '',
    address: '',
    location: '',
    neighborhood: '',
    references: '',
    repairDescription: '',
    itemBrand: '',
    itemSerial: '',
    imageID: '',
    imageHouse: '',
    assignIt: '',
    hasDelivered: '',
    sheetRow: '',
    note: '',
    selectItems: '',
    quote: '',
    startRepair: ''
  }
  return <View></View>
}

export default FormOrder
export const FormOrderE = (props) => (
  <ErrorBoundary componentName="FormOrder">
    <FormOrder {...props} />
  </ErrorBoundary>
)
