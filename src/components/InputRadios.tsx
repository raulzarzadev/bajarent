import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import RadioGroup from 'react-native-radio-buttons-group'

export type InputRadioOption = {
  label: string
  value: string
}

const InputRadios = ({
  options = [],
  setValue,
  value,
  label
}: {
  options: InputRadioOption[]
  value: string
  setValue: (value: string) => void
  label?: string
}) => {
  const radioButtons = useMemo(
    () => options.map((option) => ({ ...option, id: option.value })),
    [options]
  )

  return (
    <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
      {label && (
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{label}</Text>
      )}
      <RadioGroup
        accessibilityLabel={label}
        layout={Dimensions.get('window').width > 600 ? 'row' : 'column'}
        radioButtons={radioButtons}
        onPress={setValue}
        selectedId={value}
      />
    </View>
  )
}

export default InputRadios

const styles = StyleSheet.create({})
