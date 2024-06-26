import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ClientDetails from './ClientDetails'
import { ClientType } from '../types/ClientType'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import { useStore } from '../contexts/storeContext'
import Button from './Button'
import Loading from './Loading'
import ButtonConfirm from './ButtonConfirm'
import ClientsOrders from './ClientsOrders'

const ScreenClientDetails = (props) => {
  const [client, setClient] = useState<Partial<ClientType>>()
  const itemId = props?.route?.params?.id

  const { storeId } = useStore()
  useEffect(() => {
    if (storeId)
      ServiceStoreClients.get({
        itemId,
        storeId
      }).then((res) => {
        setClient(res)
      })
  }, [storeId])
  if (!client) return <Loading />
  return (
    <View>
      <ClientDetails client={client} />
      <ClientsOrders clientId={client.id} />
    </View>
  )
}

export default ScreenClientDetails

const styles = StyleSheet.create({})
