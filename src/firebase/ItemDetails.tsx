import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import Button from '../components/Button'
import ButtonConfirm from '../components/ButtonConfirm'
import { useStore } from '../contexts/storeContext'
import { useNavigation } from '@react-navigation/native'
import DocMetadata from '../components/DocMetadata'
import dictionary, { asCapitalize } from '../dictionary'
import { onDeleteItem } from '../libs/item_actions'
import ButtonDeleteItem from './ButtonDeleteItem'

const ItemDetails = ({ item }: { item: ItemType }) => {
  const { navigate } = useNavigation()

  return (
    <View>
      <DocMetadata item={item} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <ButtonDeleteItem itemId={item.id} />
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
      <Text style={[gStyles.tCenter, { marginVertical: 6 }]}>
        <Text style={gStyles.h3}>{asCapitalize(dictionary(item.status))}</Text>
      </Text>
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
