import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useOrderDetails } from '../../contexts/orderContext'
import unShortUrl from '../../libs/unShortUrl'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import extractCoordsFromUrl from '../../libs/extractCoordsFromUrl'
import Button from '../Button'
import ButtonConfirm from '../ButtonConfirm'
import InputTextStyled from '../InputTextStyled'
import { gStyles } from '../../styles'

export const ButtonSetOrderLocation = () => {
  const { order } = useOrderDetails()
  const orderOriginalLocation = order?.location
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newLocation, setNewLocation] = useState(orderOriginalLocation || '')
  const handleSetOrderCoords = async () => {
    setLoading(true)
    const location = newLocation || orderOriginalLocation
    const isURL = location.includes('https')
    if (isURL) {
      if (location !== orderOriginalLocation) {
        console.log('location are different, updating')
        await ServiceOrders.update(order.id, { location })
      }
      const { success, unshortened_url, message, shortened_url } =
        await unShortUrl({
          url: location
        })
      if (success) {
        const coords = extractCoordsFromUrl(unshortened_url)
        await ServiceOrders.update(order.id, { coords })
      } else {
        console.error(shortened_url, message)
        setError(
          'Ups! no se pudieron obtener las coordenadas. Intentalo mas tarde'
        )
        return await new Promise((resolve) => {
          setTimeout(() => {
            setError(null)
            resolve('done')
            setLoading(false)
          }, 5000)
        })
      }
      setLoading(false)
      return
    }
  }

  return (
    <ButtonConfirm
      openDisabled={loading}
      openLabel="Actualizar ubicación"
      icon={order?.coords ? 'location' : 'locationOff'}
      handleConfirm={async () => {
        return handleSetOrderCoords()
      }}
      confirmLabel="Actualizar"
    >
      <Text>Actualizar ubicación</Text>
      <View style={{ marginVertical: 16 }}>
        <InputTextStyled onChangeText={setNewLocation} value={newLocation} />
      </View>
      {error && <Text style={gStyles.tError}>{error}*</Text>}
      {/* <Button label="Actualizar" onPress={handleSetOrderCoords}></Button> */}
    </ButtonConfirm>
  )
}

export default ButtonSetOrderLocation

const styles = StyleSheet.create({})
