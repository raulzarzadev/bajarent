import { View, Text, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ListE } from './List'
import ItemType from '../types/ItemType'
import ListRow, { ListRowField } from './ListRow'
import { useNavigation, useRoute } from '@react-navigation/native'
import ButtonConfirm from './ButtonConfirm'
import dictionary from '../dictionary'
import useMyNav from '../hooks/useMyNav'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useStore } from '../contexts/storeContext'
import { formatItems } from '../contexts/employeeContext'
import {
  onAssignItem,
  onChangeItemSection,
  onCheckInInventory,
  onRetireItem
} from '../firebase/actions/item-actions'
import theme, { colors } from '../theme'
import Icon from './Icon'
import { ItemFixDetails } from './ItemDetails'
import { useAuth } from '../contexts/authContext'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'
import InputAssignSection from './InputAssingSection'
import { SectionType } from '../types/SectionType'
import { gStyles } from '../styles'

const OPACITY_ROW_COLOR = '66'

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

  //@ts-ignore
  const listItems = params?.ids

  const { toItems } = useMyNav()
  const { storeId, categories, storeSections } = useStore()
  const { user } = useAuth()
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
  const handleRetireItem = async (ids: string[]) => {
    //if any item here is in rent, cancel the action
    const items = await ServiceStoreItems.getList({ storeId, ids })
    const rentedItems = items.filter((item) => item.status === 'rented')
    if (rentedItems.length) {
      setErrors({ rentedItems: 'cant retire rented items' })
      setTimeout(() => {
        setErrors({})
      }, 3000)
      return console.log('cant retire rented items')
    }
    const promises = ids.map(async (id) => {
      try {
        await onRetireItem({ storeId, itemId: id, userId: user?.id })
      } catch (error) {
        console.error({ error })
        return error
      }
    })
    const res = await Promise.all(promises)
    fetchItems({ fromCache: true })
    setLoading(false)
    return res
  }
  const [items, setItems] = useState<Partial<ItemType>[]>([])

  const fetchItems = async (props?: { fromCache?: boolean }) => {
    const { fromCache } = props || {}
    if (Array.isArray(listItems) && listItems.length > 0) {
      ServiceStoreItems.getList(
        { storeId, ids: listItems },
        { fromCache }
      ).then((res) => {
        setItems(res)
      })
      return
    }
    if (allItems) {
      ServiceStoreItems.getAll({ storeId }, { fromCache }).then((res) => {
        setItems(res)
      })
      return
    }

    if (allItemsSections?.length) {
      ServiceStoreItems.getAll(
        {
          storeId,
          sections: allItemsSections
        },
        { fromCache }
      ).then((res) => {
        setItems(res)
      })
      return
    }
    if (availableItemsSections?.length) {
      ServiceStoreItems.getAvailable(
        {
          storeId,
          sections: availableItemsSections
        },
        { fromCache }
      ).then((res) => {
        setItems(res)
      })
      return
    }
    if (getAllAvailable) {
      ServiceStoreItems.getAvailable({ storeId }, { fromCache }).then((res) => {
        setItems(res)
      })
    }
  }

  useEffect(() => {
    fetchItems({ fromCache: true })
  }, [allItemsSections])

  const handleAddInventoryEntry = async (ids: string[]) => {
    const promises = ids.map(async (id) => {
      try {
        await onCheckInInventory({ storeId, itemId: id, userId: user?.id })
      } catch (error) {
        console.error({ error })
        return error
      }
    })
    const res = await Promise.all(promises)
    fetchItems({ fromCache: true })
    setLoading(false)
    return res
  }
  useEffect(() => {
    if (storeId) {
      fetchItems({ fromCache: true })
    }
  }, [storeId])

  const [errors, setErrors] = useState<{ rentedItems?: string }>({})

  const formattedItems = formatItems(
    items?.map((item) => ({ ...item, id: item.id })),
    categories,
    storeSections
  )

  const handleAssignItems = async (
    ids: string[],
    sectionId: SectionType['id'],
    sectionName: SectionType['name']
  ) => {
    setLoading(true)
    const promises = ids.map(async (id) => {
      try {
        return onChangeItemSection({
          itemId: id,
          storeId,
          sectionId,
          sectionName
        })
      } catch (error) {
        console.error({ error })
        return error
      }
    })
    const res = await Promise.all(promises)
    fetchItems({ fromCache: true })
    setLoading(false)
    return res
  }

  return (
    <View>
      <ListE
        maxWidth={1000}
        defaultOrder="des"
        defaultSortBy="number"
        pinRows
        ComponentMultiActions={({ ids }) => (
          <View>
            <View style={{ marginVertical: 8 }}>
              <InputAssignSection
                currentSection=""
                disabled={loading}
                setNewSection={async ({ sectionId, sectionName }) => {
                  await handleAssignItems(ids, sectionId, sectionName)
                }}
              />
            </View>
            <View style={{ marginVertical: 8 }}>
              <ButtonConfirm
                openDisabled={loading}
                openLabel="Invetario"
                openVariant="outline"
                icon="inventory"
                text={`Se marcaran inventarios en los ${
                  ids?.length || 0
                } artículos seleccionados`}
                handleConfirm={async () => await handleAddInventoryEntry(ids)}
              />
            </View>

            <View style={{ marginVertical: 8 }}>
              {!!errors?.rentedItems && (
                <Text
                  style={{
                    color: theme.error,
                    marginVertical: 6,
                    textAlign: 'center'
                  }}
                >
                  *No se pueden dar de BAJA artículos en renta
                </Text>
              )}
              <ButtonConfirm
                openDisabled={loading}
                openLabel="Dar de baja"
                openColor="secondary"
                openVariant="outline"
                icon="download"
                text={`Se daran de baja ${
                  ids?.length || 0
                } artículos seleccionados`}
                handleConfirm={async () => await handleRetireItem(ids)}
              />
            </View>
            <View style={{ marginVertical: 8 }}>
              <ButtonConfirm
                openDisabled={loading}
                openLabel="Eliminar"
                openColor="error"
                openVariant="outline"
                icon="delete"
                text={`Se eliminaran los ${
                  ids?.length || 0
                } artículos seleccionados`}
                handleConfirm={async () => await handleDeleteItems(ids)}
              />
            </View>
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
        data={formattedItems}
        filters={[
          { field: 'assignedSectionName', label: 'Area' },
          { field: 'categoryName', label: 'Categoría' },
          { field: 'brand', label: 'Marca' },
          { field: 'status', label: 'Estado' },
          {
            field: 'needFix',
            label: 'Necesita Reparación',
            boolean: true,
            color: colors.red,
            icon: 'wrench',
            titleColor: colors.white
          },
          {
            field: 'isRented',
            label: 'En renta',
            boolean: true,
            color: `${theme.success}${OPACITY_ROW_COLOR}`,
            icon: 'rent'
          },
          {
            field: 'isPickedUp',
            label: 'Recogido',
            boolean: true,
            color: `${theme.primary}${OPACITY_ROW_COLOR}`,
            icon: 'truck'
          },
          {
            field: 'checkedInInventory',
            label: 'Inventariado hoy',
            boolean: true,
            color: `${colors.pink}${OPACITY_ROW_COLOR}`,
            icon: 'inventory'
          }
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
  const needFix = item?.needFix
  const bgcolor: Record<ItemType['status'], string> = {
    rented: theme.success,
    pickedUp: theme.primary,
    retired: theme.neutral
  }
  const inventoryCheckedToday = isToday(asDate(item?.lastInventoryAt))
  const isBigScreen = Dimensions.get('window').width > 600

  const rowFields: ListRowField[] = [
    {
      width: '20%',
      component: (
        <View style={{ flexDirection: isBigScreen ? 'row' : 'column' }}>
          <View style={{ width: 18 }}>
            {inventoryCheckedToday && (
              <Icon icon={'inventory'} color={colors.black} size={16} />
            )}
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ marginRight: 8 }}>{item.number}</Text>
            <Text style={gStyles.helper}>{item.serial}</Text>
          </View>
        </View>
      )
    },
    { width: '20%', component: <Text>{item.assignedSectionName}</Text> },
    {
      width: '20%',
      component: (
        <View>
          <Text>{item.categoryName}</Text>
          <Text style={gStyles.helper}>{item.brand}</Text>
        </View>
      )
    },
    {
      width: 'rest',
      component: <Text>{dictionary(item.status)}</Text>
    }
  ]
  if (isBigScreen) {
    rowFields.push({
      width: '30%',
      component: (
        <View>
          {!!needFix && (
            <View
              style={
                {
                  // justifyContent: 'flex-end',
                  // width: '100%',
                  // alignItems: 'flex-end'
                }
              }
            >
              <ItemFixDetails itemId={item?.id} size="sm" />
            </View>
          )}
        </View>
      )
    })
  } else {
    rowFields.push({
      width: 'rest',
      component: (
        <View>
          {!!needFix && (
            <View>
              <Icon icon="wrench" color={colors.red} size={14} />
            </View>
          )}
        </View>
      )
    })
  }

  return (
    <ListRow
      style={{
        padding: 4,
        borderRadius: 5,
        borderWidth: 2,
        width: '100%',
        marginVertical: 2,
        borderColor: needFix ? colors.red : 'transparent',
        backgroundColor: `${bgcolor[item.status]}${OPACITY_ROW_COLOR}`
      }}
      fields={rowFields}
    />
  )
}

export default ListStoreItems
