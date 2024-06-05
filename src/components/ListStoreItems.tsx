import { View, Text } from 'react-native'
import React from 'react'
import { ListE } from './List'
import StoreType from '../types/StoreType'
import ItemType from '../types/ItemType'
import ListRow from './ListRow'
import { useNavigation } from '@react-navigation/native'

const ListStoreItems = () => {
  const { navigate } = useNavigation()
  const items = Object.values(storeItems)
  console.log({ items })
  return (
    <View>
      <ListE
        sideButtons={[
          {
            icon: 'location',
            onPress() {
              // @ts-ignore
              navigate('ScreenItemsMap')
            },
            label: 'Mapa',
            visible: true
          },
          {
            icon: 'add',
            onPress() {
              // @ts-ignore
              navigate('ScreenItem')
            },
            label: 'Agregar',
            visible: true
          }
        ]}
        data={items.map((item) => ({ ...item, id: item.id }))}
        filters={[]}
        ComponentRow={({ item }) => {
          return <RowItem item={item} />
        }}
      />
    </View>
  )
}

const RowItem = ({ item }: { item: Partial<ItemType> }) => {
  return (
    <ListRow
      style={{
        padding: 4,
        borderRadius: 5,
        borderWidth: 1,
        width: '100%',
        marginVertical: 2
      }}
      fields={[
        { width: '15%', component: <Text>{item.number}</Text> },
        { width: '30%', component: <Text>{item.category}</Text> },
        { width: '25%', component: <Text>{item.brand}</Text> },
        { width: '30%', component: <Text>{item.serial}</Text> }
      ]}
    />
  )
}

const storeItems: StoreType['items'] = {
  fasfoo234: {
    status: 'stock',
    brand: 'maytag',
    category: 'lavadora',
    assignedSection: '12314',
    id: 'fasfoo234',
    number: '1',
    serial: '324FDK234'
  },
  item1: {
    status: 'stock',
    brand: 'samsung',
    category: 'refrigerator',
    assignedSection: '56789',
    id: 'item1',
    number: '2',
    serial: 'ABCD1234'
  },
  item2: {
    status: 'sold',
    brand: 'lg',
    category: 'television',
    assignedSection: '98765',
    id: 'item2',
    number: '3',
    serial: 'EFGH5678'
  },
  item3: {
    status: 'stock',
    brand: 'sony',
    category: 'headphones',
    assignedSection: '43210',
    id: 'item3',
    number: '4',
    serial: 'IJKL9012'
  },
  item4: {
    status: 'available',
    brand: 'apple',
    category: 'phone',
    assignedSection: '24680',
    id: 'item4',
    number: '5',
    serial: 'MNOP3456'
  },
  item5: {
    status: 'maintenance',
    brand: 'dell',
    category: 'laptop',
    assignedSection: '13579',
    id: 'item5',
    number: '6',
    serial: 'QRST7890'
  }
}

export default ListStoreItems
