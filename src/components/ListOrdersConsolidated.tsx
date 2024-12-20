import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LoadingList } from './List'
import ListRow, { ListRowField } from './ListRow'
import {
  ConsolidatedOrderType,
  ConsolidatedStoreOrdersType,
  ServiceConsolidatedOrders
} from '../firebase/ServiceConsolidatedOrders'
import { useNavigation } from '@react-navigation/native'
import { useOrdersCtx } from '../contexts/ordersContext'
import { useStore } from '../contexts/storeContext'
import { gStyles } from '../styles'
import { colors } from '../theme'
import OrderDirectives from './OrderDirectives'
import asDate, { dateFormat, fromNow } from '../libs/utils-date'
import ErrorBoundary from './ErrorBoundary'
import MultiOrderActions from './OrderActions/MultiOrderActions'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Button from './Button'
export type OrderWithId = Partial<ConsolidatedOrderType> & {
  id: string
  itemsString?: string
}

const ListOrdersConsolidated = () => {
  const { consolidatedOrders, handleRefresh, setOtherConsolidated } =
    useOrdersCtx()
  const { storeId, sections: storeSections } = useStore()
  const { navigate } = useNavigation()
  const orders = consolidatedOrders?.orders || {}

  const data: OrderWithId[] = Array.from(Object.values(orders)).map((order) => {
    const assignedToSection =
      storeSections?.find((section) => section.id === order.assignToSection)
        ?.name || null
    return {
      id: order.id,
      ...order,
      assignToSectionName: assignedToSection
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

  const [otherConsolidates, setOtherConsolidates] = useState<
    ConsolidatedStoreOrdersType[]
  >([])
  const [otherConsolidatedCount, setOtherConsolidatedCount] = useState(10)
  useEffect(() => {
    if (storeId)
      ServiceConsolidatedOrders.getLasts({
        storeId,
        count: otherConsolidatedCount
      }).then((res) => {
        setOtherConsolidates(res)
      })
  }, [storeId, otherConsolidatedCount])
  const modal = useModal({ title: 'Otras consolidadas' })

  return (
    <ScrollView>
      <View>
        <StyledModal {...modal}>
          {otherConsolidates.map((consolidated) => {
            return (
              <Pressable
                key={consolidated.id}
                onPress={() => {
                  setOtherConsolidated({ consolidated })
                  modal.toggleOpen()
                }}
              >
                <Text>
                  {dateFormat(asDate(consolidated.createdAt))}{' '}
                  <Text style={gStyles.tBold}>{consolidated.ordersCount}</Text>
                </Text>
              </Pressable>
            )
          })}
          <Button
            size="xs"
            variant="ghost"
            onPress={() => {
              setOtherConsolidatedCount(otherConsolidatedCount + 10)
            }}
            label="mas"
            icon="down"
          ></Button>
        </StyledModal>
        <Pressable onPress={() => modal.toggleOpen()}>
          <Text style={[gStyles.helper, gStyles.tCenter]}>
            Última actualización{' '}
            {fromNow(asDate(consolidatedOrders?.createdAt))}
          </Text>
        </Pressable>
        <LoadingList
          ComponentRow={({ item }) => <ComponentRow item={item} />}
          pinRows
          collectionSearch={{
            collectionName: 'orders',
            fields: ['fullName', 'folio', 'status', 'neighborhood', 'note']
          }}
          ComponentMultiActions={({ ids }) => {
            return <MultiOrderActions ordersIds={ids} data={data} />
          }}
          data={data}
          //pinRows={true}
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
            //@ts-ignore
            navigate('StackConsolidated', {
              screen: 'OrderDetails',
              params: { orderId }
            })
          }}
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
            },
            {
              field: 'createdAt',
              label: 'Creación',
              isDate: true
            },
            {
              field: 'expireAt',
              label: 'Vencimiento',
              isDate: true
            },
            {
              field: 'deliveredAt',
              label: 'Entregada',
              isDate: true
            },
            {
              field: 'pickedUpAt',
              label: 'Recogida',
              isDate: true
            }
          ]}
          sortFields={[
            {
              key: 'folio',
              label: 'Folio'
            },
            {
              key: 'note',
              label: 'Contrato'
            },
            {
              key: 'fullName',
              label: 'Nombre'
            },
            {
              key: 'neighborhood',
              label: 'Colonia'
            },
            {
              key: 'type',
              label: 'Tipo'
            },
            {
              key: 'assignToSection',
              label: 'Area'
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
              key: 'itemsString',
              label: 'Item'
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
      width: 120,
      component: (
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
          >
            <Text style={{ textAlign: 'center' }} numberOfLines={1}>
              {order?.folio}
            </Text>
            <Text style={{ textAlign: 'center' }} numberOfLines={1}>
              {order?.note}
            </Text>
          </View>
          <Text style={styles.cell} numberOfLines={1}>
            {order?.fullName}
          </Text>
        </View>
      )
    },
    {
      width: 70,
      component: (
        <View style={{ alignItems: 'stretch' }}>
          <Text
            style={[gStyles.helper, gStyles.tBold, gStyles.tCenter]}
            numberOfLines={1}
          >
            {order?.itemsString}
          </Text>
          <Text style={[gStyles.helper]} numberOfLines={1}>
            {order?.neighborhood}
          </Text>
        </View>
      )
    },
    // {
    //   width: 50,
    //   component: (
    //     <Text style={styles.cell} numberOfLines={1}>
    //       {order?.neighborhood}
    //     </Text>
    //   )
    // },
    {
      width: 'rest',
      //@ts-ignore
      component: <OrderDirectives order={order} />
    }
  ]
  return (
    <ListRow
      fields={fields}
      style={{
        marginVertical: 2,
        padding: 2,
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
