import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ListE } from './List'
import StoreType from '../types/StoreType'
import ItemType from '../types/ItemType'
import ListRow from './ListRow'
import { useNavigation } from '@react-navigation/native'
import ButtonConfirm from './ButtonConfirm'
import dictionary from '../dictionary'
import useMyNav from '../hooks/useMyNav'

const ListStoreItems = ({ items }: { items: Partial<ItemType>[] }) => {
  const { navigate } = useNavigation()
  const { toItem } = useMyNav()
  const [loading, setLoading] = useState(false)
  const handleDeleteItems = async (ids: string[]) => {
    const promises = ids.map(async (id) => {
      setLoading(true)
      return res
    })
    const res = await Promise.all(promises)
    setLoading(false)
    return res
  }
  return (
    <View>
      <ListE
        ComponentMultiActions={({ ids }) => (
          <View>
            <ButtonConfirm
              openDisabled={loading}
              openLabel="Eliminar"
              openColor="error"
              openVariant="outline"
              icon="delete"
              text={`Se eliminaran los ${ids?.length || 0} items seleccionados`}
              handleConfirm={() => handleDeleteItems(ids)}
            />
          </View>
        )}
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
              navigate('ScreenItemNew')
            },
            label: 'Agregar',
            visible: true
          }
        ]}
        data={items?.map((item) => ({ ...item, id: item.id }))}
        filters={[
          { field: 'assignedSectionName', label: 'Area' },
          { field: 'categoryName', label: 'Categoría' },
          { field: 'brand', label: 'Marca' },
          { field: 'status', label: 'Estado' }
        ]}
        sortFields={[
          { key: 'number', label: 'Número' },
          { key: 'categoryName', label: 'Categoría' },
          { key: 'assignedSectionName', label: 'Area' },
          { key: 'brand', label: 'Marca' },
          { key: 'serial', label: 'Serial' },
          { key: 'status', label: 'Estado' }
        ]}
        onPressRow={(rowId) => {
          console.log({ rowId })
          // @ts-ignore
          toItem({ id: rowId })
        }}
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
        { width: '20%', component: <Text>{item.number}</Text> },
        { width: '20%', component: <Text>{item.categoryName}</Text> },
        { width: '20%', component: <Text>{item.assignedSectionName}</Text> },
        {
          width: '20%',
          component: (
            <View>
              <Text>{item.brand}</Text>
              <Text>{item.serial}</Text>
            </View>
          )
        },
        { width: '20%', component: <Text>{dictionary(item.status)}</Text> }
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
  },
  item6: {
    status: 'stock',
    brand: 'hp',
    category: 'printer',
    assignedSection: '97531',
    id: 'item6',
    number: '7',
    serial: 'UVWX1234'
  },
  item7: {
    status: 'sold',
    brand: 'canon',
    category: 'camera',
    assignedSection: '86420',
    id: 'item7',
    number: '8',
    serial: 'YZAB5678'
  },
  item8: {
    status: 'stock',
    brand: 'lenovo',
    category: 'tablet',
    assignedSection: '75319',
    id: 'item8',
    number: '9',
    serial: 'CDEF9012'
  },
  item9: {
    status: 'available',
    brand: 'lg',
    category: 'monitor',
    assignedSection: '64208',
    id: 'item9',
    number: '10',
    serial: 'GHIJ3456'
  },
  item10: {
    status: 'maintenance',
    brand: 'samsung',
    category: 'microwave',
    assignedSection: '53197',
    id: 'item10',
    number: '11',
    serial: 'KLMN7890'
  }
}

export default ListStoreItems
