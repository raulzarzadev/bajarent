import { View, Text } from 'react-native'
import ButtonConfirm from './ButtonConfirm'
import { useState } from 'react'
import { useOrderDetails } from '../contexts/orderContext'
import InputTextStyled from './InputTextStyled'
import { ServiceOrders } from '../firebase/ServiceOrders'
const ModalChangeOrderFolio = () => {
  const { order } = useOrderDetails()
  const [currentFolio, setCurrentFolio] = useState(order.folio)
  return (
    <ButtonConfirm
      justIcon
      icon="edit"
      handleConfirm={async () => {
        return await ServiceOrders.update(order.id, { folio: currentFolio })
      }}
      openVariant="ghost"
      openSize="xs"
    >
      <View>
        <Text>Folio actual: {currentFolio}</Text>
        <Text>Nuevo folio:</Text>
        <InputTextStyled
          value={currentFolio}
          type="number"
          onChangeText={(text) => setCurrentFolio(Number(text))}
        />
      </View>
    </ButtonConfirm>
  )
}
export default ModalChangeOrderFolio
