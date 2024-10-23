import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { ServiceComments } from '../firebase/ServiceComments'
import { useStore } from '../contexts/storeContext'
import asDate, { dateFormat, endDate, startDate } from '../libs/utils-date'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType from '../types/OrderType'
import List from './List'
import ListRow from './ListRow'
import dictionary from '../dictionary'
import DateCell from './DateCell'
import DateLapse from './DateLapse'

const ScreenWorkshopHistory = () => {
  return (
    <ScrollView>
      <WorkshopHistoryExternalRepairs />
    </ScrollView>
  )
}

const WorkshopHistoryExternalRepairs = () => {
  const { storeId } = useStore()

  const [workshopDateMovements, setWorkshopDateMovements] = useState([])
  const [orders, setOrders] = useState<Partial<OrderType[]>>([])

  useEffect(() => {
    if (storeId) {
      ServiceComments.getWorkshopDateMovements({
        fromDate: startDate(new Date()),
        toDate: endDate(new Date()),
        storeId
      }).then((res) => {
        setWorkshopDateMovements(res)
        const ordersMovements = res.reduce((acc, curr) => {
          acc.includes(curr.orderId) ? acc : acc.push(curr.orderId)
          return acc
        }, [])
        ServiceOrders.getList(ordersMovements).then((res) => {
          setOrders(res)
        })
      })
    }
  }, [storeId])

  const formattedOrdersWithHistory = orders.map((order) => {
    const orderMovements = workshopDateMovements.filter(
      (m) => m.orderId === order.id
    )
    return {
      ...order,
      movements: orderMovements
    }
  })

  return (
    <View>
      <DateLapse />

      <View style={{ maxWidth: 800, marginHorizontal: 'auto' }}>
        <List
          filters={[]}
          data={formattedOrdersWithHistory}
          sortFields={[]}
          ComponentRow={({ item: order }) => {
            const [expanded, setExpanded] = useState(false)
            return (
              <Pressable onPress={() => setExpanded(!expanded)}>
                <ListRow
                  fields={[
                    {
                      component: <Text>{order?.folio}</Text>,
                      width: 80
                    },
                    {
                      component: <Text>{order?.fullName}</Text>,
                      width: 120
                    },
                    {
                      component: (
                        <Text>{dictionary(order.workshopStatus)}</Text>
                      ),
                      width: 80
                    },
                    {
                      component: (
                        <View>{<Text>{order?.movements?.length}</Text>}</View>
                      ),
                      width: 80
                    }
                  ]}
                />
                {expanded && (
                  <View style={{ paddingLeft: 12 }}>
                    {order?.movements?.map((movement) => (
                      <ListRow
                        key={movement.id}
                        fields={[
                          {
                            component: (
                              <Text>
                                {dateFormat(
                                  asDate(movement?.createdAt),
                                  ' HH:mm '
                                )}
                              </Text>
                            ),
                            width: 'auto'
                          },
                          {
                            component: (
                              <Text>{dictionary(movement?.type)}</Text>
                            ),
                            width: 80
                          },
                          {
                            component: <Text>{movement.itemNumber}</Text>,
                            width: 50
                          },
                          {
                            component: <Text>{movement?.content}</Text>,
                            width: 'rest'
                          }
                        ]}
                      />
                    ))}
                  </View>
                )}
              </Pressable>
            )
          }}
        ></List>
      </View>
    </View>
  )
}
export const ScreenWorkshopHistoryE = (props) => (
  <ErrorBoundary componentName="ScreenWorkshopHistory">
    <ScreenWorkshopHistory {...props} />
  </ErrorBoundary>
)
export default ScreenWorkshopHistory
