import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ClientDetails from './ClientDetails'
import { ClientType } from '../types/ClientType'
import { ServiceStoreClients } from '../firebase/ServiceStoreClients2'
import { useStore } from '../contexts/storeContext'
import FormClient, { FormClientE } from './FormClient'
import Loading from './Loading'

const ScreenClientEdit = (props) => {
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
  if (!client) return <Loading />
  return (
    <View>
      <FormClientE client={client} />
    </View>
  )
}

export default ScreenClientEdit

const styles = StyleSheet.create({})
