import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ClientType } from '../types/ClientType'
import { CardClient } from './ButtonCreateClient'
const ClientDetails = ({ client }: { client: Partial<ClientType> }) => {
  return (
    <View>
      <CardClient client={client} />
    </View>
  )
}

export default ClientDetails

const styles = StyleSheet.create({})
