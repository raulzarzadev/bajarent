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

const dark: Theme = {
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

export const STATUS_COLOR = {
  PENDING: '#ffe4e6',
  AUTHORIZED: '#fde68a',
  DELIVERED: theme.success,
  CANCELLED: '#9ca3af',
  REPORTED: theme.error,
  PICKUP: '#f472b6'
}

export const FONT_SIZE = 10
export const FONT_FAMILY = 'Roboto'
export const BORDER_RADIUS = 4
export const PADDING = 4
export const MARGIN = 4

const light = theme
export { dark, light }
export default theme
