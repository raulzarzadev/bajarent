import { View } from 'react-native'
import React from 'react'
import InputCheckbox from './InputCheckbox'
import ErrorBoundary from './ErrorBoundary'

const Inputs = () => {
  const [checked, setChecked] = React.useState(false)
  return (
    <View>
      <InputCheckbox label="Checkbox" setValue={setChecked} />
      <InputCheckbox
        label="Controlled checked"
        setValue={setChecked}
        value={checked}
      />
    </View>
  )
}
export const InputsE = () => {
  return (
    <ErrorBoundary componentName="Inputs">
      <Inputs />
    </ErrorBoundary>
  )
}
export default Inputs
