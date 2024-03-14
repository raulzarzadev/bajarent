import RNPickerSelect from 'react-native-picker-select'
import { gStyles } from '../styles'

export type SelectOptions = {
  label: string
  value: string
}[]

const InputSelect = ({
  options = [],
  onChangeValue
}: {
  options?: SelectOptions
  onChangeValue?: (value) => void
}) => {
  return (
    <RNPickerSelect
      style={{
        inputWeb: gStyles.inputStyle
      }}
      onValueChange={onChangeValue}
      items={options}
      placeholder={{ label: 'Seleccionar', value: '' }}
    />
  )
}

export default InputSelect
