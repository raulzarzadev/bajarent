import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ClientDetails from './ClientDetails'
import { ClientType } from '../types/ClientType'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import { useStore } from '../contexts/storeContext'
import Button from './Button'

const ScreenClientDetails = (props) => {
  const { navigate } = props.navigation
  const [client, setClient] = useState<Partial<ClientType>>()
  const itemId = props?.route?.params?.id
  const { storeId } = useStore()
  useEffect(() => {
    if (storeId)
      ServiceStoreClients.getItem({
        itemId,
        storeId
      }).then((res) => {
        setClient(res)
      })
  }, [storeId])
  return (
    <View>
      <ClientDetails client={client} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button
          size="small"
          icon="delete"
          color="error"
          variant="outline"
          label="Eliminar"
          onPress={() => {
            //ServiceStoreClients.deleteItem({ itemId, storeId })
            navigate('ScreenClients')
          }}
        ></Button>
        <Button
          size="small"
          icon="edit"
          label="Editar"
          onPress={() => {
            navigate('ScreenClientEdit', { id: itemId })
          }}
        ></Button>
      </View>
    </View>
  )
}

export default ScreenClientDetails

const styles = StyleSheet.create({})
