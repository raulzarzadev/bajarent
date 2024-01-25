import { StyleSheet, Text, View } from 'react-native'
import React, { useMemo, useState } from 'react'
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
      {label && <Text style={{ textAlign: 'center' }}>{label}</Text>}
      <RadioGroup
        accessibilityLabel="Radio buttons"
        layout="row"
        radioButtons={radioButtons}
        onPress={setValue}
        selectedId={value}
      />
    </View>
  )
}

export default InputRadios

const styles = StyleSheet.create({})
