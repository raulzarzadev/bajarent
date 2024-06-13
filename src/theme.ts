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
  placeholder?: string
  transparent: string
}

export const colors = {
  green: '#65a30d',
  red: '#f87171',
  yellow: '#facc15',
  blue: '#547EE8',
  lightBlue: '#93c5fd',
  darkBlue: '#1d4ed8',
  gray: '#9ca3af',
  lightGray: '#e5e7eb',
  darkGray: '#374151',
  black: '#000000',
  white: '#e5e5e5',
  transparent: 'transparent',
  pink: '#f472b6',
  purple: '#9333ea',
  orange: '#fb923c',
  indigo: '#6366f1',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  lime: '#84cc16',
  amber: '#f59e0b',
  emerald: '#10b981',
  lightPink: '#f9a8d4',
  lightPurple: '#d6bcfa'
} as const

export type BasicColors = keyof typeof colors

const theme: Theme = {
  primary: colors.blue,
  secondary: colors.darkBlue,
  accent: colors.darkGray,
  neutral: colors.gray,
  base: colors.lightGray,
  info: colors.lightBlue,
  success: colors.green,
  warning: colors.yellow,
  error: colors.red,
  white: colors.white,
  black: colors.black,
  placeholder: '#555e',
  transparent: colors.transparent
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
  PENDING: theme.transparent,
  AUTHORIZED: theme.success,

  DELIVERED: theme.transparent,
  PICKUP: theme.secondary,
  PICKED_UP: theme.secondary,

  CANCELLED: theme.transparent,
  RENEWED: theme.transparent,

  REPORTED: theme.error,
  EXPIRED: theme.warning,
  [order_status.REPAIRING]: theme.secondary,
  [order_status.REPAIRED]: theme.warning,
  REPAIR_DELIVERED: theme.neutral,
  EXPIRE_TODAY: theme.error,
  EXPIRED_TOMORROW: theme.warning
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
