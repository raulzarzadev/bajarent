import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ListE } from './List'
import StoreType from '../types/StoreType'
import ItemType from '../types/ItemType'
import ListRow from './ListRow'
import { useNavigation, useRoute } from '@react-navigation/native'
import ButtonConfirm from './ButtonConfirm'
import dictionary from '../dictionary'
import useMyNav from '../hooks/useMyNav'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useStore } from '../contexts/storeContext'
import { formatItems } from '../contexts/employeeContext'

const ListStoreItems = ({
  allItemsSections,
  allItems,
  availableItemsSections,
  getAllAvailable
}: {
  allItemsSections?: string[]
  availableItemsSections?: string[]
  allItems?: boolean
  getAllAvailable?: boolean
}) => {
  const { navigate } = useNavigation()
  const { params } = useRoute()
  const listItems = params?.ids

  const { toItems } = useMyNav()
  const { storeId, categories, storeSections } = useStore()
  const [loading, setLoading] = useState(false)
  const handleDeleteItems = async (ids: string[]) => {
    const promises = ids.map(async (id) => {
      try {
        const res = await ServiceStoreItems.delete({ itemId: id, storeId })
        return res
      } catch (error) {
        console.error({ error })
        return error
      }
    })
    const res = await Promise.all(promises)
    // fetchItems()
    setLoading(false)
    return res
  }
  const [items, setItems] = useState<Partial<ItemType>[]>([])
  useEffect(() => {
    if (storeId) {
      if (Array.isArray(listItems) && listItems.length > 0) {
        ServiceStoreItems.getList({ storeId, ids: listItems }).then((res) => {
          setItems(res)
        })
        return
      }
      if (allItems) {
        ServiceStoreItems.getAll({ storeId }).then((res) => {
          setItems(res)
        })
        return
      }

      if (allItemsSections?.length) {
        ServiceStoreItems.getAll({
          storeId,
          sections: allItemsSections
        }).then((res) => {
          setItems(res)
        })
        return
      }
      if (availableItemsSections?.length) {
        ServiceStoreItems.getAvailable({
          storeId,
          sections: availableItemsSections
        }).then((res) => {
          setItems(res)
        })
        return
      }
      if (getAllAvailable) {
        ServiceStoreItems.getAvailable({ storeId }).then((res) => {
          setItems(res)
        })
      }
    }
  }, [storeId])

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
              handleConfirm={async () => await handleDeleteItems(ids)}
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
              toItems({ screenNew: true })
            },
            label: 'Agregar',
            visible: true
          }
          // {
          //   icon: 'refresh',
          //   onPress: () => fetchItems(),
          //   label: 'Refrescar',
          //   visible: true
          // }
        ]}
        data={formatItems(
          items?.map((item) => ({ ...item, id: item.id })),
          categories,
          storeSections
        )}
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
          toItems({ id: rowId })
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

export default ListStoreItems
