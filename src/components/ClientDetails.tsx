import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ClientType } from '../types/ClientType'
import { CardClientE } from './CardClient'
const ClientDetails = ({ client }: { client: Partial<ClientType> }) => {
  return (
    <View>
      <CardClientE client={client} />
    </View>
  )
}

export default ClientDetails

const styles = StyleSheet.create({})
