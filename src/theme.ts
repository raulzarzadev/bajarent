import { th } from 'date-fns/locale'
import { order_status } from './types/OrderType'

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
  primary: '#c7d2fe',
  secondary: '#a78bfa',
  accent: '#e7e5efb',
  neutral: '#fecaca',
  base: '#cffafe',
  info: '#60a5fa',
  success: '#65a30d',
  warning: '#fef08a',
  error: '#f87171',
  white: '#e5e5e5',
  black: '#000000'
} as const

export type Colors = keyof Theme

const darkTheme: Theme = {
  primary: '#009cff',
  secondary: '#1d4ed8',
  accent: '#d1d5db',
  neutral: '#13131d',
  base: '#272e38',
  info: '#0090d7',
  success: '#65a30d',
  warning: '#facc15',
  error: '#ef4444',
  white: '#e5e5e5',
  black: '#000000'
}

export const STATUS_COLOR: Record<order_status, string> = {
  PENDING: theme.white,
  AUTHORIZED: theme.warning,

  DELIVERED: theme.success,
  PICKUP: '#f472b6',

  CANCELLED: theme.neutral,
  RENEWED: theme.primary,

  REPORTED: theme.error,
  EXPIRED: theme.error
}

export const FONT_SIZE = 10
export const FONT_FAMILY = 'Roboto'
export const BORDER_RADIUS = 4
export const PADDING = 4
export const MARGIN = 4

const light = darkTheme
const dark = darkTheme
export { dark, light }
export default theme
