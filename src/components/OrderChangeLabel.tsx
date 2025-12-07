import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { colors } from '../theme'
import InputRadios from './InputRadios'

const OrderChangeLabel = ({
  orderId,
  currentColor,
  setColor
}: {
  orderId: string
  currentColor: string
  setColor?: (color: string) => void
}) => {
  const colorsOptions = [
    { label: 'Rojo', value: colors.red, color: colors.red },
    { label: 'Azul', value: colors.blue, color: colors.blue },
    { label: 'Verde', value: colors.green, color: colors.green },
    { label: 'Amarillo', value: colors.yellow, color: colors.yellow },
    { label: 'sin', value: '' }
  ]
  const [_color, _setColor] = useState(currentColor)
  useEffect(() => {
    _setColor(currentColor)
  }, [currentColor])
  const handleSelectColor = async (color) => {
    _setColor(color)
    setColor?.(color)
    await ServiceOrders.update(orderId, { colorLabel: color })
      .then(console.log)
      .catch(console.error)
  }

  return (
    <View>
      <InputRadios
        layout="row"
        options={colorsOptions}
        setValue={handleSelectColor}
        value={_color}
      />
    </View>
  )
}

export default OrderChangeLabel
