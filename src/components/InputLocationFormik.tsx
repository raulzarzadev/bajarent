import { useField } from 'formik'
import { StyleSheet } from 'react-native'
import InputLocation from './InputLocation'

const InputLocationFormik = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name)
  return (
    <InputLocation
      value={field.value}
      setValue={helpers.setValue}
      helperText={meta.error}
      {...props}
    />
  )
}

export default InputLocationFormik
