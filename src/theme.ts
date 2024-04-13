import { order_status, order_type } from './types/OrderType'

export type Theme = {
  primary: string
  secondary: string
  accent: string
  neutral: string
  base: string
  info: string
  success: string
  warning: string
  error: string
  white: string
  black: string
}

const theme: Theme = {
  primary: '#547EE8',
  secondary: '#1948BD',
  accent: '#e7e5efb',
  neutral: '#fecaca',
  base: '#cffafe',
  info: '#60a5fa',
  success: '#65a30d',
  warning: '#B5D911',
  error: '#f87171',
  white: '#e5e5e5',
  black: '#000000'
} as const

export type Colors = keyof Theme

// const theme: Theme = {
//   primary: '#009cff',
//   secondary: '#1d4ed8',
//   accent: '#d1d5db',
//   neutral: '#13131d',
//   base: '#272e38',
//   info: '#0090d7',
//   success: '#65a30d',
//   warning: '#facc15',
//   error: '#ef4444',
//   white: '#e5e5e5',
//   black: '#000000'
// }

export const ORDER_TYPE_COLOR: Record<order_type, string> = {
  [order_type.RENT]: '#68b6c9',
  [order_type.SALE]: '#0a73ac',
  [order_type.REPAIR]: '#f9b162',
  [order_type.STORE_RENT]: '#f472b6',
  [order_type.DELIVERY_RENT]: '#6DE89D',
  [order_type.DELIVERY_SALE]: '#5A5357',
  [order_type.MULTI_RENT]: '#086383'
}

export const STATUS_COLOR: Record<order_status, string> = {
  PENDING: theme.white,
  AUTHORIZED: theme.warning,

  DELIVERED: theme.success,
  PICKUP: '#f472b6',
  PICKED_UP: '#f472b6',

  CANCELLED: theme.neutral,
  RENEWED: theme.neutral,

  REPORTED: theme.error,
  EXPIRED: theme.error,
  [order_status.REPAIRING]: theme.success,
  [order_status.REPAIRED]: theme.warning,
  REPAIR_DELIVERED: theme.neutral
}

export const FONT_SIZE = 10
export const FONT_FAMILY = 'Roboto'
export const BORDER_RADIUS = 4
export const PADDING = 4
export const MARGIN = 4

const light = theme
const dark = theme
export { dark, light }
export default theme
