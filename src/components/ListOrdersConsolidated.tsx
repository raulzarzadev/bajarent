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
import OrderDirectives from './OrderDirectives'
import asDate, { fromNow } from '../libs/utils-date'
import ErrorBoundary from './ErrorBoundary'
type OrderWithId = ConsolidatedOrderType & { id: string }

const ListOrdersConsolidated = () => {
  const { consolidatedOrders, handleRefresh } = useOrdersCtx()
  const { storeId, storeSections } = useStore()
  const { navigate } = useNavigation()
  const orders = consolidatedOrders?.orders || {}
  const data: OrderWithId[] = Array.from(Object.values(orders)).map((order) => {
    const assignedSection =
      storeSections.find((section) => section.id === order.assignToSection)
        ?.name || null
    return {
      id: order.id,
      ...order,
      assignedSection
    }
  })
  const [disabled, setDisabled] = useState(false)

  const handleConsolidate = async () => {
    setDisabled(true)
    await ServiceConsolidatedOrders.consolidate(storeId)
      .then((res) => {
        console.log({ res })
      })
      .catch((err) => {
        console.error(err)
      })

    await handleRefresh()
    setDisabled(false)
  }

  return (
    <ScrollView>
      <View style={gStyles.container}>
        {/* <View>
          <TextInfo text="Estas ordenes se generan de forma manual, al hacer click en el logo de guardar"></TextInfo>
          <TextInfo text="Te ayudaran a buscar mas rapido ordenes especificas. "></TextInfo>
        </View> */}
        <Text style={[gStyles.helper, gStyles.tCenter]}>
          Última actualización {fromNow(asDate(consolidatedOrders?.createdAt))}
        </Text>
        <LoadingList
          rowsPerPage={20}
          sideButtons={[
            {
              icon: 'save',
              label: 'Consolidar',
              onPress: async () => {
                await handleConsolidate()
              },
              disabled,
              visible: true
            }
          ]}
          onPressRow={(orderId) => {
            console.log({ orderId })
            //@ts-ignore
            navigate('StackConsolidated', {
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
              field: 'assignToSection',
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
            {
              key: 'expireAt',
              label: 'Vencimiento'
            },
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
          {order.fullName}
        </Text>
      )
    },
    {
      //field: order.type,
      width: 50,
      component: (
        <Text style={styles.cell} numberOfLines={1}>
          {dictionary(order.type)}
        </Text>
      )
    },
    {
      //field: order.status,
      width: 200,
      component: (
        <View>
          {/* <Text style={styles.cell} numberOfLines={1}>
            {dictionary(order.status)}
          </Text> */}
          <OrderDirectives order={order} />
        </View>
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

export const ListOrdersConsolidatedE = (props) => (
  <ErrorBoundary componentName="ListOrdersConsolidated">
    <ListOrdersConsolidated {...props} />
  </ErrorBoundary>
)

export default ListOrdersConsolidated
