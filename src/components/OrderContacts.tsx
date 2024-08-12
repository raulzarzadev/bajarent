import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useOrderDetails } from '../contexts/orderContext'
import CardPhone from './CardPhone'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import { gStyles } from '../styles'
import FormContacts from './FormContacts'
import {
  onAddContact,
  onMarkContactAsFavorite,
  onRemoveContact
} from '../libs/order-actions'
import ButtonIcon from './ButtonIcon'
import OrderType, { ContactType } from '../types/OrderType'
import ButtonConfirm from './ButtonConfirm'

const OrderContacts = () => {
  const { order } = useOrderDetails()
  const modal = useModal({ title: 'Lista de contactos' })
  const contacts = order?.contacts as ContactType[]

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

      <ContactsList />
      <StyledModal {...modal}>
        <ContactsList />
        <Text style={gStyles.h3}>Agregar contacto</Text>
        <FormContacts
          onSubmit={(contact) => {
            onAddContact({ contact, orderId: order.id })
          }}
        />
      </StyledModal>
    </View>
  )
}

export const ContactsList = () => {
  const { order } = useOrderDetails()
  const handleMarkAsFavorite = (contactId: ContactType['id']) => {
    onMarkContactAsFavorite({
      contact: contacts.find(({ id }) => contactId === id),
      orderId: order.id,
      isFavorite: !contacts.find(({ id }) => contactId === id)?.isFavorite
    })
  }
  const handleDeleteContact = (contactId: ContactType['id']) => {
    onRemoveContact({
      contact: contacts.find(({ id }) => contactId === id),
      orderId: order.id
    })
  }

  const sortById = (a: ContactType, b: ContactType) => {
    return a?.id?.localeCompare(b?.id)
  }

  const contacts = order?.contacts as ContactType[]
  return (
    <View>
      <ContactRow contact={{ phone: order.phone, name: '' }} />
      {contacts?.sort(sortById).map((contact, i) => (
        <ContactRow
          contact={contact}
          key={i}
          handleDeleteContact={handleDeleteContact}
          handleMarkAsFavorite={handleMarkAsFavorite}
        />
      ))}
    </View>
  )
}

const ContactRow = ({
  contact,
  handleMarkAsFavorite,
  handleDeleteContact
}: {
  contact: ContactType
  handleMarkAsFavorite?: (contactId: ContactType['id']) => void
  handleDeleteContact?: (contactId: ContactType['id']) => void
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {handleMarkAsFavorite && (
        <Button
          justIcon
          icon={contact.isFavorite ? 'starFilled' : 'starEmpty'}
          color={contact.isFavorite ? 'success' : 'info'}
          variant="ghost"
          onPress={() => {
            handleMarkAsFavorite(contact?.id)
          }}
        />
      )}
      <Text>{contact.name} </Text>
      <CardPhone phone={contact.phone} />
      {handleDeleteContact && (
        <ButtonConfirm
          justIcon
          icon={'delete'}
          modalTitle="Eliminar contacto"
          openColor={'error'}
          openVariant="ghost"
          confirmLabel="Eliminar"
          text="¿Estás seguro de eliminar este contacto?"
          confirmColor="error"
          confirmVariant="outline"
          handleConfirm={async () => {
            return await handleDeleteContact(contact?.id)
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text>{contact.name} </Text>
            <CardPhone phone={contact.phone} />
          </View>
        </ButtonConfirm>
      )}
    </View>
  )
}

export default OrderContacts

const styles = StyleSheet.create({})
