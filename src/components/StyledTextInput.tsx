import { StyleSheet, TextInput, TextInputProps } from 'react-native'
import theme from '../theme'

/**
 * Componente de entrada de texto estilizado.
 *
 * @param {TextInputProps} props - Propiedades del componente TextInput.
 * @returns {JSX.Element} - Elemento JSX que representa el componente StyledTextInput.
 */
const StyledTextInput = ({ ...props }: TextInputProps) => {
  return <TextInput style={styles.inputStyle} {...props} />
}

export default StyledTextInput

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    borderColor: theme.colors.lightgrey,
    borderRadius: theme.borderRadius.md,
    padding: theme.padding.sm,
    marginVertical: theme.margin.sm,
    width: '100%'
  }
})
