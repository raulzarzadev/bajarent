import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import Button from '../components/Button'
import ButtonConfirm from '../components/ButtonConfirm'
import { ServiceStoreItems } from './ServiceStoreItems'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'

const ItemDetails = ({ item }: { item: ItemType }) => {
  const { storeId, categories } = useStore()
  const { goBack, navigate } = useNavigation()
  const handleDelete = async () => {
    goBack()
    return await ServiceStoreItems.itemDelete(storeId, item.id)
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ButtonConfirm
          text="¿Estas seguro de eliminar este item?"
          handleConfirm={async () => {
            return handleDelete()
          }}
          openVariant="ghost"
          justIcon
          openColor="error"
          icon="delete"
          confirmColor="error"
          confirmLabel="Eliminar"
        />
        <Button
          onPress={() => {
            //@ts-ignore
            navigate('ScreenItemEdit', { id: item.id })
          }}
          variant="ghost"
          justIcon
          color="primary"
          icon="edit"
        />
      </View>
      <Text style={gStyles.h2}>Numero: {item.number}</Text>
      <Text>
        Categoria:
        {item.categoryName}
      </Text>
      <Text>No.de serie: {item.serial}</Text>
      <Text>Marca: {item.brand}</Text>
      <Text>
        Area asignada:
        {item.assignedSectionName}
      </Text>
    </View>
  )
}

export default ItemDetails

const styles = StyleSheet.create({})
