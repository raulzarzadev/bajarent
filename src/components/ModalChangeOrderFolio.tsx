import { useState } from 'react'
import { Text, View } from 'react-native'
import { useOrderDetails } from '../contexts/orderContext'
import { ServiceOrders } from '../firebase/ServiceOrders'
import ButtonConfirm from './ButtonConfirm'
import InputTextStyled from './InputTextStyled'

const ModalChangeOrderFolio = () => {
  const { order } = useOrderDetails()
  const [currentFolio, setCurrentFolio] = useState(order.folio)
  return (
    <ButtonConfirm
      justIcon
      icon="edit"
      handleConfirm={async () => {
        await ServiceOrders.update(order.id, { folio: currentFolio })
        return
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
