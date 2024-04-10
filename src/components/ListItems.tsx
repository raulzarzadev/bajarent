import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import List from './List'
import { ItemList } from '../libs/getItemsFromOrders'

const ListItems = ({ items }: { items: ItemList[] }) => {
  return (
    <List
      data={items}
      ComponentRow={({ item }) => (
        <View
          style={{ flexDirection: 'row', padding: 2, margin: 4, width: '100%' }}
        >
          <Text numberOfLines={1} style={{ width: '50%' }}>
            {item?.categoryName}
          </Text>
          <Text numberOfLines={1} style={{ width: '20%', textAlign: 'center' }}>
            {item?.folio}
          </Text>
          <Text numberOfLines={1} style={{ width: '30%' }}>
            {item?.clientName}
          </Text>
        </View>
      )}
      filters={[]}
      sortFields={[
        {
          key: 'categoryName',
          label: 'Categoria'
        },
        {
          key: 'folio',
          label: 'Folio'
        },
        {
          key: 'clientName',
          label: 'Cliente'
        }
      ]}
    />
  )
}

export default ListItems

const styles = StyleSheet.create({})
