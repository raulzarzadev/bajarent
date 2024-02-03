import { StyleSheet } from 'react-native'

// global styles
export const gSpace = (space = 1) => space * 4

export const gStyles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    alignItems: 'center',
    textAlign: 'center'
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
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
    padding: 8
  }
})
