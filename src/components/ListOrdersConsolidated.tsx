import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import List, { LoadingList } from './List'
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
  const { consolidatedOrders, handleRefresh } = useOrdersCtx()
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
    handleRefresh()
    setDisabled(true)
    ServiceConsolidatedOrders.consolidate(storeId)
      .then((res) => {
        console.log({ res })
      })
      .finally(() => {
        setDisabled(false)
      })
  }

  return (
    <ScrollView>
      <View style={gStyles.container}>
        <View>
          <TextInfo text="Estas ordenes se generan de forma manual, al hacer click en el logo de guardar"></TextInfo>
          <TextInfo text="Te ayudaran a buscar mas rapido ordenes especificas. "></TextInfo>
        </View>
        <LoadingList
          rowsPerPage={20}
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
              label: 'Area'
            },
            // {
            //   field: 'expireAt',
            //   label: 'Vencimiento'
            // },

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
            // {
            //   key: 'expireAt',
            //   label: 'Vencimiento'
            // },
            {
              key: 'folio',
              label: 'Folio'
            },
            {
              key: 'note',
              label: 'Contrato'
            }
          ]}
        />
      </View>
    </ScrollView>
  )
}

const ComponentRow = ({ item: order }: { item: OrderWithId }) => {
  const fields: ListRowField[] = [
    {
      // field: order.name,
      width: 'rest',
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {order.name}
        </Text>
      )
    },
    {
      //field: order.type,
      width: '20%',
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {dictionary(order.type)}
        </Text>
      )
    },
    {
      //field: order.status,
      width: '20%',
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {dictionary(order.status)}
        </Text>
      )
    },
    // {
    //   //field: order.expireAt,
    //   width: 60,
    //   component: (
    //     <Text style={styles.cell} numberOfLines={1}>
    //       {dateFormat(asDate(order.expireAt), 'dd/MM/yyyy')}
    //     </Text>
    //   )
    // },
    {
      //field: `${order.folio}`,
      width: 50,
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {order.folio}
        </Text>
      )
    },
    {
      //field: order.note,
      width: 50,
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
