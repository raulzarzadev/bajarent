import RNPickerSelect from 'react-native-picker-select'
import { gStyles } from '../styles'

export type SelectOptions = {
  label: string
  value: string
}[]

const InputSelect = ({
  options = [],
  onChangeValue,
  value
}: {
  options?: SelectOptions
  onChangeValue?: (value) => void
  value?: string
}) => {
  return (
    <RNPickerSelect
      value={value}
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
