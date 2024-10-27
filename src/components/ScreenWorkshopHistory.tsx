import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { useStore } from '../contexts/storeContext'
import { endDate, startDate } from '../libs/utils-date'
import { ServiceOrders } from '../firebase/ServiceOrders'
import OrderType, { order_type } from '../types/OrderType'
import DateLapse from './DateLapse'
import { gStyles } from '../styles'
import { ServiceItemHistory } from '../firebase/ServiceItemHistory'
import { RowWorkshopItemsE } from './RowWorkshopItems'
import { formatItemsFromRepair } from '../libs/workshop.libs'
import theme from '../theme'

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
      {/* <RepairedRentItems fromDate={fromDate} toDate={toDate} /> */}
    </View>
  )
}

// export const RepairedRentItems = ({
//   fromDate = new Date(),
//   toDate = new Date()
// }: {
//   fromDate: Date
//   toDate: Date
// }) => {
//   const { storeId } = useStore()
//   const [created, setCreated] = useState<Partial<any[]>>([])
//   const [cancelled, setCancelled] = useState<Partial<any[]>>([])
//   const [started, setStarted] = useState<Partial<any[]>>([])
//   const [finished, setFinished] = useState<Partial<any[]>>([])
//   useEffect(() => {
//     if (storeId) {
//       ServiceItemHistory.getFieldBetweenDates({
//         field: 'createdAt',
//         fromDate: startDate(fromDate),
//         toDate: endDate(toDate),
//         storeId
//       }).then(setCreated)
//     }
//   }, [storeId])
//   console.log({
//     created,
//     cancelled,
//     started,
//     finished
//   })
//   return (
//     <Text>
//       <ResumeRepairs cancelled={[]} created={[]} finished={[]} started={[]} />
//     </Text>
//   )
// }

export const RepairOrdersReport = ({ fromDate, toDate }) => {
  const { storeId } = useStore()
  const [created, setCreated] = useState<Partial<OrderType[]>>([])
  const [cancelled, setCancelled] = useState<Partial<OrderType[]>>([])
  const [started, setStarted] = useState<Partial<OrderType[]>>([])
  const [finished, setFinished] = useState<Partial<OrderType[]>>([])
  useEffect(() => {
    if (storeId) {
      //* <--- Get by created date
      ServiceOrders.getFieldBetweenDates({
        storeId,
        field: 'createdAt',
        fromDate,
        toDate
      }).then(setCreated)

      //* <--- Get by cancelledAt date
      ServiceOrders.getFieldBetweenDates({
        storeId,
        field: 'cancelledAt',
        fromDate,
        toDate
      }).then(setCancelled)

      //* <--- Get by repairing date
      ServiceOrders.getFieldBetweenDates({
        storeId,
        field: 'workshopFlow.startedAt',
        fromDate,
        toDate
      }).then(setStarted)

      //* <--- Get by finishedAt date
      ServiceOrders.getFieldBetweenDates({
        storeId,
        field: 'workshopFlow.finishedAt',
        fromDate,
        toDate
      }).then(setFinished)
    }
  }, [storeId, fromDate, toDate])

  return (
    <ResumeRepairs
      cancelled={cancelled}
      created={created}
      finished={finished}
      started={started}
    />
  )
}

type List = 'created' | 'canceled' | 'started' | 'finished'
export const ResumeRepairs = ({
  created,
  cancelled,
  started,
  finished
}: {
  created: any[]
  cancelled: any[]
  started: any[]
  finished: any[]
}) => {
  const { categories, storeSections } = useStore()
  const [items, setItems] = useState([])
  const [selectedOption, setSelectedOption] = useState<List>(null)
  const handleShowList = (list: List) => {
    if (selectedOption === list) {
      setSelectedOption(null)
      setItems([])
      return
    } else {
      setSelectedOption(list)
      const lists = {
        created: created,
        canceled: cancelled,
        started: started,
        finished: finished
      }

      const res = formatItemsFromRepair({
        repairOrders: lists[list],
        categories,
        storeSections
      })
      console.log({ res })
      setItems(res)
    }
  }

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around'
        }}
      >
        <OptionList
          label="Creadas"
          name={'created'}
          onPress={handleShowList}
          items={created}
          selectedOption={selectedOption}
        />
        <OptionList
          label="Canceladas"
          name={'canceled'}
          onPress={handleShowList}
          items={cancelled}
          selectedOption={selectedOption}
        />
        <OptionList
          label="Iniciadas"
          name={'started'}
          onPress={handleShowList}
          items={started}
          selectedOption={selectedOption}
        />
        <OptionList
          label="Terminadas"
          name={'finished'}
          onPress={handleShowList}
          items={finished}
          selectedOption={selectedOption}
        />
      </View>
      <View style={{ display: items?.length > 0 ? 'flex' : 'none' }}>
        <RowWorkshopItemsE items={items} title="Pedidos" />
      </View>
    </View>
  )
}

const OptionList = ({
  label,
  name,
  onPress,
  items,
  selectedOption
}: {
  label: string
  name: List
  onPress: (value: List) => void
  items: any[]
  selectedOption: List
}) => {
  return (
    <Pressable
      style={{
        borderWidth: 2,
        borderColor: name === selectedOption ? theme.accent : 'transparent',
        borderRadius: 8,
        width: 100,
        height: 40
      }}
      onPress={() => {
        onPress(name)
      }}
    >
      <Text style={{ textAlign: 'center' }}>{label}</Text>
      <Text style={{ textAlign: 'center' }}>{items.length}</Text>
    </Pressable>
  )
}

export const ScreenWorkshopHistoryE = (props) => (
  <ErrorBoundary componentName="ScreenWorkshopHistory">
    <ScreenWorkshopHistory {...props} />
  </ErrorBoundary>
)
export default ScreenWorkshopHistory
