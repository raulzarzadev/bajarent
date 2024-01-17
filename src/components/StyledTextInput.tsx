import { StyleSheet, TextInput } from 'react-native'
import theme from './theme'

const StyledTextInput = ({ ...props }) => {
  return <TextInput style={styles.inputStyle} {...props} />
}

export default StyledTextInput

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    borderColor: theme.colors.highlight,
    borderRadius: theme.borderRadius.md,
    padding: theme.padding.sm,
    marginVertical: theme.margin.sm,
    width: '100%'
  }
})
