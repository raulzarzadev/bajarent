import { ViewStyle } from 'react-native'

const measures = (scale: number = 1) => ({
  xs: 4 * scale,
  sm: 8 * scale,
  md: 16 * scale,
  lg: 32 * scale
})

const font = {
  family: 'System',
  size: measures(1)
}

const borderRadius = measures()

const padding = measures()

const margin = measures()

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
    primary: '#0070f3',
    background: '#f5f5f5',
    // text: '#333333',
    accent: '#ffcc00',
    secondary: '#999999',
    highlight: '#333333',
    error: '#ff0000',
    success: '#00cc00',
    white: '#ffffff',
    black: '#000000'
  },
  font,
  padding,
  margin,
  borderRadius,
  h1,
  p

  // Add any additional theme properties here
}
// Agrega las propiedades que dependen de las primeras

export default theme
