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
  label,
  layout
}: {
  options: InputRadioOption[]
  value: string
  setValue: (value: string) => void
  label?: string
  layout?: 'row' | 'column'
}) => {
  const radioButtons = useMemo(
    () => options.map((option) => ({ ...option, id: option.value })),
    [options]
  )

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RadioGroup
        accessibilityLabel={label}
        layout={
          layout || Dimensions.get('window').width > 600 ? 'row' : 'column'
        }
        radioButtons={radioButtons}
        onPress={setValue}
        selectedId={value}
        labelStyle={{ textTransform: 'capitalize' }}
      />
    </View>
  )
}

export default InputRadios

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignSelf: 'center' },
  label: {
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }
})
