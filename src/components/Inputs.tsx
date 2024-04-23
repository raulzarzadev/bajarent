import { View } from 'react-native'
import React from 'react'
import InputCheckbox from './InputCheckbox'
import ErrorBoundary from './ErrorBoundary'
import InputPhone from './InputPhone'

const Inputs = () => {
  const [checked, setChecked] = React.useState(false)
  const [phone, setPhone] = React.useState('')
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <InputCheckbox label="Checkbox" setValue={setChecked} />
        <InputCheckbox
          label="Controlled checked"
          setValue={setChecked}
          value={checked}
        />
      </View>
      <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
        <InputPhone
          onChange={(phone) => {
            setPhone(phone)
          }}
        />
        <InputPhone
          onChange={(phone) => setPhone(phone)}
          defaultNumber={'+52554336e345'}
        />
      </View>
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
