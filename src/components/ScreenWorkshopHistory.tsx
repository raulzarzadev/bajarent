import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { ServiceComments } from '../firebase/ServiceComments'
import { useStore } from '../contexts/storeContext'
import asDate, { dateFormat, endDate, startDate } from '../libs/utils-date'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_type } from '../types/OrderType'
import List from './List'
import ListRow from './ListRow'
import dictionary from '../dictionary'
import DateCell from './DateCell'
import DateLapse from './DateLapse'
import { gStyles } from '../styles'
import { useOrdersCtx } from '../contexts/ordersContext'

const ScreenWorkshopHistory = () => {
  return (
    <ScrollView>
      <WorkshopHistoryExternalRepairs />
    </ScrollView>
  )
}

const WorkshopHistoryExternalRepairs = () => {
  const [fromDate, setFromDate] = useState(startDate(new Date()))
  const [toDate, setToDate] = useState(endDate(new Date()))

  return (
    <View>
      <DateLapse setFromDate={setFromDate} setToDate={setToDate} />
      <Text style={gStyles.h3}>De reparación</Text>
      <RepairOrdersReport
        fromDate={startDate(fromDate)}
        toDate={endDate(toDate)}
      />
    </View>
  )
}

export const RepairOrdersReport = ({ fromDate, toDate }) => {
  const { storeId } = useStore()
  const [created, setCreated] = useState<Partial<OrderType[]>>([])
  const [cancelled, setCancelled] = useState<Partial<OrderType[]>>([])
  const [repairStarted, setRepairStarted] = useState<Partial<OrderType[]>>([])

  useEffect(() => {
    if (storeId) {
      //* <--- Get by created date
      ServiceOrders.getFieldBetweenDates({
        storeId,
        field: 'createdAt',
        fromDate,
        toDate
      }).then(setCreated)

      //* <--- Get by scheduled date
      ServiceOrders.getFieldBetweenDates({
        storeId,
        field: 'cancelledAt',
        fromDate,
        toDate
      }).then(setCancelled)

      //* <--- Get by scheduled date
      ServiceOrders.getFieldBetweenDates({
        storeId,
        field: 'repairStartedAt',
        fromDate,
        toDate
      }).then(setRepairStarted)
    }
  }, [storeId, fromDate, toDate])

  console.log({ created, cancelled, repairStarted })

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around'
      }}
    >
      <View>
        <Text>Pedidos</Text>
      </View>
      <View>
        <Text>Canceladas</Text>
      </View>
      <View>
        <Text>Inciadas</Text>
      </View>
      <View>
        <Text>Terminadas</Text>
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
