import { StyleSheet } from 'react-native'
import theme, { BORDER_RADIUS, PADDING } from './theme'

// global styles
export const gSpace = (space = 1) => space * 4
const placeholderOpacity = 'ee'

export const gStyles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    alignItems: 'center',
    textAlign: 'center'
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    //marginBottom: 4,
    alignItems: 'center',
    textAlign: 'center'
  },
  h3: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    alignItems: 'center',
    textAlign: 'center'
  },
  container: {
    maxWidth: 500,
    margin: 'auto',
    width: '100%',
    padding: 8,
    maxHeight: '100%'
  },
  p: {
    fontSize: 16,
    marginBottom: 4
  },
  helper: {
    fontSize: 10
  },
  helperError: {
    fontSize: 10,
    color: theme.error
  },
  tCenter: {
    textAlign: 'center'
  },
  tBold: {
    fontWeight: 'bold'
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: theme.neutral,
    borderRadius: BORDER_RADIUS * 1.8,
    padding: PADDING * 3,
    width: '100%',
    placeholderTextColor: theme.neutral // Set placeholder text color to transparent
  }
})
