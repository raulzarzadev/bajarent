import { StyleSheet, TextInput } from 'react-native'

const StyledTextInput = ({ ...props }) => {
  return <TextInput style={styles.inputStyle} {...props} />
}

export default StyledTextInput

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    width: '100%'
  }
})
