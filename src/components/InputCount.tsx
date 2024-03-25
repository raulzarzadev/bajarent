import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { gStyles } from '../styles'
import Button from './Button'

const InputCount = ({
  label = 'Cantidad',
  value = 0,
  setValue,
  disabled
}: {
  label: string
  value?: number
  setValue?: (qty: number) => void
  disabled?: boolean
}) => {
  const [qty, setQty] = React.useState(0)
  const handleAdd = () => {
    setQty(qty + 1)
    setValue?.(qty + 1)
  }
  const handleSub = () => {
    setQty(qty - 1)
    setValue?.(qty - 1)
  }

  useEffect(() => {
    setQty(value)
  }, [value])

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text style={[gStyles.h2]}>{label}:</Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <Button
          icon="sub"
          variant="ghost"
          size="xs"
          justIcon
          onPress={handleSub}
          disabled={disabled}
        />
        <Text style={[gStyles.h2, [disabled && { opacity: 0.5 }]]}>{qty}</Text>
        <Button
          icon="add"
          variant="ghost"
          size="xs"
          justIcon
          onPress={handleAdd}
          disabled={disabled}
        />
      </View>
    </View>
  )
}

export default InputCount
