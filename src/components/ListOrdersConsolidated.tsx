import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import List from './List'
import ListRow, { ListRowField } from './ListRow'
import {
  ConsolidatedOrderType,
  ServiceConsolidatedOrders
} from '../firebase/ServiceConsolidatedOrders'
import dictionary from '../dictionary'
import { useNavigation } from '@react-navigation/native'
import { useOrdersCtx } from '../contexts/ordersContext'
import TextInfo from './TextInfo'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import { colors } from '../theme'
type OrderWithId = ConsolidatedOrderType & { id: string }

const ListOrdersConsolidated = () => {
  const { consolidatedOrders } = useOrdersCtx()
  const { storeId, storeSections } = useStore()
  const { navigate } = useNavigation()
  const orders = consolidatedOrders?.orders || {}
  const data: OrderWithId[] = Array.from(Object.values(orders)).map((order) => {
    const assignedSection =
      storeSections.find((section) => section.id === order.assignedSection)
        ?.name || null
    return {
      id: order.orderId,
      ...order,
      assignedSection
    }
  })
  const [disabled, setDisabled] = useState(false)

  const handleConsolidate = () => {
    setDisabled(true)
    ServiceConsolidatedOrders.consolidate(storeId).then((res) => {
      console.log({ res })
    })
    setTimeout(() => {
      setDisabled(false)
    }, 10000) // 10 seconds
    console.log('Consolidar')
  }

  return (
    <ScrollView>
      <View style={[gStyles.container]}>
        <TextInfo text="Estas ordenes se generan de forma manual, al hacer click en el logo de guardar"></TextInfo>
        <TextInfo text="Te ayudaran a buscar mas rapido ordenes especificas. "></TextInfo>
      </View>
      <List
        sideButtons={[
          {
            icon: 'save',
            label: 'Consolidar',
            onPress: () => {
              handleConsolidate()
            },
            disabled,
            visible: true
          }
        ]}
        onPressRow={(orderId) => {
          //@ts-ignore
          navigate('StackOrders', {
            screen: 'OrderDetails',
            params: { orderId }
          })
        }}
        data={data}
        ComponentRow={({ item }) => <ComponentRow item={item} />}
        filters={[
          {
            field: 'type',
            label: 'Tipo'
          },
          {
            field: 'status',
            label: 'Estatus'
          },
          {
            field: 'assignedSection',
            label: 'Seccion'
          },
          {
            field: 'neighborhood',
            label: 'Colonia'
          }
        ]}
        sortFields={[
          {
            key: 'name',
            label: 'Nombre'
          },
          {
            key: 'type',
            label: 'Tipo'
          },
          {
            key: 'status',
            label: 'Status'
          },
          {
            key: 'folio',
            label: 'Folio'
          },
          {
            key: 'note',
            label: 'Nota'
          }
        ]}
      />
    </ScrollView>
  )
}

const ComponentRow = ({ item: order }: { item: OrderWithId }) => {
  const fields: ListRowField[] = [
    {
      field: order.name,
      width: '30%',
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {order.name}
        </Text>
      )
    },
    {
      field: order.type,
      width: '20%',
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {dictionary(order.type)}
        </Text>
      )
    },
    {
      field: order.status,
      width: '20%',
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {dictionary(order.status)}
        </Text>
      )
    },
    {
      field: `${order.folio}`,
      width: '20%',
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {order.folio}
        </Text>
      )
    },
    {
      field: order.note,
      width: '10%',
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {order.note}
        </Text>
      )
    }
    // {
    //   field: order.neighborhood,
    //   width: '10%',
    //   component: <Text numberOfLines={1}>{order.neighborhood}</Text>
    // }
    // {
    //   field: order.phone,
    //   width: '20%',
    //   component: <Text numberOfLines={1}>{order.neighborhood}</Text>
    // }
  ]
  return (
    <ListRow
      fields={fields}
      style={{
        marginVertical: 2,
        borderColor: 'transparent',
        backgroundColor: colors.white
      }}
    />
  )
}
const styles = StyleSheet.create({
  cell: {
    textAlign: 'center'
  }
})

export default ListOrdersConsolidated
