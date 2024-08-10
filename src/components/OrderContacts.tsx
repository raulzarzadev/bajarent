import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useOrderDetails } from '../contexts/orderContext'
import CardPhone from './CardPhone'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { gStyles } from '../styles'

const OrderContacts = () => {
  const { order } = useOrderDetails()
  const modal = useModal({ title: 'Lista de contactos' })
  return (
    <View style={{ marginVertical: 16 }}>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Text style={gStyles.h2}>Contactos </Text>

        <Button justIcon icon="add" onPress={modal.toggleOpen} size="small" />
      </View>
      {order?.phone && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View style={{ padding: 6 }}>
            <Text style={{ textAlign: 'right' }}>{'Principal'}</Text>
          </View>
          <CardPhone phone={order.phone} />
        </View>
      )}
      <ContactsList contacts={order.contacts} />
      <StyledModal {...modal}>
        <ContactsList contacts={order.contacts} />
        <Text></Text>
      </StyledModal>
    </View>
  )
}

export const ContactsList = ({ contacts }) => {
  return (
    <View>
      {contacts?.map((contact, i) => (
        <View key={i}>
          <Text>{contact.name}</Text>
          <CardPhone phone={contact.phone} />
        </View>
      ))}
    </View>
  )
}

export default OrderContacts

const styles = StyleSheet.create({})
