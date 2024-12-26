import { StyleSheet, Text, View } from 'react-native'
import { InputDateE } from './InputDate'
import Icon from './Icon'
import { useState } from 'react'

const InputDatesRage = ({
  defaultValues,
  onChange,
  disabled
}: {
  disabled?: boolean
  defaultValues: { fromDate?: Date; toDate?: Date }
  onChange?: (values: { fromDate: Date; toDate: Date }) => void
}) => {
  const [values, setValues] = useState({
    fromDate: defaultValues.fromDate,
    toDate: defaultValues.toDate
  })
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ justifyContent: 'center' }}>
          <InputDateE
            format="E dd/MMM"
            withTime
            label="Desde "
            value={values.fromDate}
            setValue={(value) => {
              setValues((values) => ({ ...values, fromDate: value }))
              onChange?.({ ...values, fromDate: value })
            }}
            disabled={disabled}
          />
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Icon icon="rowRight" />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <InputDateE
            disabled={disabled}
            withTime
            format="E dd/MMM"
            label="Hasta "
            value={values.toDate}
            setValue={(value) => {
              setValues((values) => ({ ...values, toDate: value }))
              onChange?.({ ...values, toDate: value })
            }}
          />
        </View>
      </View>
    </View>
  )
}
export default InputDatesRage
const styles = StyleSheet.create({})
