import { ViewStyle } from 'react-native'
import { OrderStatus } from './types/OrderType'

const measures = (scale: number = 1) => ({
  xs: 8 * scale,
  sm: 10 * scale,
  md: 12 * scale,
  lg: 18 * scale
})

const font = {
  family: 'System',
  size: measures(1),
  bold: 'bold'
}

const borderRadius = measures()

const padding = measures()

const margin = measures()

const colors = {
  blue: '#0070f3',
  lightBlue: '#79b8ff',
  white: '#ffffff',
  black: '#000000',
  yellow: '#ffcc00',
  red: '#ff0000',
  green: '#00cc00',
  gray: '#999999',
  lightGray: '#C0C0C0',
  darkGray: '#333333'
}

const statusColor: Record<OrderStatus, string> = {
  PENDING: 'transparent',
  AUTHORIZED: colors.lightBlue,
  DELIVERED: colors.green,
  CANCELLED: colors.gray,
  REPORTED: colors.red,
  PICKUP: colors.lightGray
}

const h1 = {
  fontSize: font.size.lg,
  fontWeight: 600,
  textAlign: 'center'
} as ViewStyle
const p = {
  fontSize: font.size.md,
  fontWeight: 400,
  textAlign: 'center'
} as ViewStyle

const theme = {
  colors: {
    primary: colors.blue,
    background: colors.lightGray,
    // text: '#333333',
    accent: colors.yellow,
    secondary: colors.lightBlue,
    highlight: colors.darkGray,
    error: colors.red,
    success: colors.green,
    white: colors.white,
    black: colors.black,
    disabled: colors.lightGray,
    lightgrey: colors.lightGray
  },
  font,
  padding,
  margin,
  borderRadius,
  h1,
  p,
  statusColor

  // Add any additional theme properties here
}

export default theme
