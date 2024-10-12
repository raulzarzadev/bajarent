import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import { useItemsCtx } from '../contexts/itemsContext'
import RowWorkshopItems from './RowWorkshopItems'
import HeaderDate from './HeaderDate'
import { ServiceItemHistory } from '../firebase/ServiceItemHistory'
import asDate, { dateFormat, endDate, startDate } from '../libs/utils-date'
import List from './List'
import ListRow from './ListRow'
import dictionary from '../dictionary'
import useMyNav from '../hooks/useMyNav'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import ItemType from '../types/ItemType'
import ErrorBoundary from './ErrorBoundary'
import {
  formatItems,
  formatItemsFromRepair,
  splitItems
} from '../libs/workshop.libs'
import Divider from './Divider'

const ScreenWorkshop = () => {
  const { workshopItems, repairOrders } = useItemsCtx()
  console.log({ repairOrders })

  const itemsPickedUp = workshopItems.filter(
    (item) => item.status === 'pickedUp'
  )

  const { needFix, inProgress, finished } = splitItems({ items: itemsPickedUp })

  const itemsNeedFix = needFix
  const itemsInProgress = inProgress
  const itemsFinished = finished

  const { categories, storeSections } = useStore()

  const formattedPendingItems = formatItems(
    itemsNeedFix,
    categories,
    storeSections
  )
  const formattedInProgressItems = formatItems(
    itemsInProgress,
    categories,
    storeSections
  )
  const formattedFinishedItems = formatItems(
    itemsFinished,
    categories,
    storeSections
  )
  const formatRepairItems = formatItemsFromRepair({
    repairOrders,
    categories,
    storeSections
  })
  const {
    shouldPickup,
    needFix: repairNeedFix,
    inProgress: repairInProgress,
    finished: repairFinished
  } = splitItems({ items: formatRepairItems })

  return (
    <ScrollView style={{ maxWidth: 800, width: '100%', margin: 'auto' }}>
      <View style={{ maxWidth: 200, marginLeft: 'auto' }}>
        <ModalViewMovements />
      </View>
      <RepairStepE title="Por recoger" repairItems={shouldPickup} />

      <RepairStepE
        title="Pendientes"
        rentItems={formattedPendingItems}
        repairItems={repairNeedFix}
      />

      <RepairStepE
        title="En reparación"
        rentItems={formattedInProgressItems}
        repairItems={repairInProgress}
      />

      <RepairStepE
        title="Terminadas"
        rentItems={formattedFinishedItems}
        repairItems={repairFinished}
      />
    </ScrollView>
  )
}

export type RepairStepProps = {
  title: string
  rentItems?: Partial<ItemType>[]
  repairItems?: Partial<ItemType>[]
}
export const RepairStepE = (props: RepairStepProps) => (
  <ErrorBoundary componentName="RepairStep">
    <RepairStep {...props} />
  </ErrorBoundary>
)
const RepairStep = ({
  title,
  rentItems = [],
  repairItems = []
}: RepairStepProps) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[gStyles.h2, { textAlign: 'left' }]}>
        {title} {`(${rentItems?.length + repairItems?.length})`}
      </Text>
      <View style={{ paddingLeft: 16 }}>
        {rentItems.length > 0 && (
          <View>
            <RowWorkshopItems items={rentItems} />
          </View>
        )}
        {repairItems.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={[{ textAlign: 'left' }]}>
              Reparaciones ({repairItems.length})
            </Text>
            <RowWorkshopItems items={repairItems} />
          </View>
        )}
      </View>
      <Divider />
    </View>
  )
}

const ModalViewMovements = () => {
  const modal = useModal({ title: 'Movimientos de taller' })
  return (
    <View>
      <Button
        label="Movimientos"
        onPress={modal.toggleOpen}
        variant="ghost"
      ></Button>
      <StyledModal {...modal} size="full">
        <WorkshopMovements />
      </StyledModal>
    </View>
  )
}

const WorkshopMovements = () => {
  const { storeId } = useStore()
  const { toItems } = useMyNav()
  const [date, setDate] = useState(new Date())
  const { items } = useItemsCtx()
  const [movements, setMovements] = useState([])

  useEffect(() => {
    if (storeId && items?.length > 0) {
      ServiceItemHistory.getWorkshopDateMovements({
        fromDate: startDate(date),
        toDate: endDate(date),
        storeId,
        items
      }).then((res) => {
        setMovements(
          res.sort(
            (a, b) =>
              asDate(b.createdAt).getTime() - asDate(a.createdAt).getTime()
          )
        )
      })
    }
  }, [date, storeId, items?.length])
  return (
    <View style={{ width: '100%' }}>
      <View style={{ marginTop: 8 }}></View>
      <HeaderDate label="Movimientos" onChangeDate={setDate} />
      <List
        onPressRow={(id) =>
          toItems({ id: movements.find((m) => m.id === id)?.itemId })
        }
        ComponentRow={({ item }) => (
          <ListRow
            fields={[
              {
                component: (
                  <Text>{dateFormat(asDate(item?.createdAt), ' HH:mm ')}</Text>
                ),
                width: 'auto'
              },
              {
                component: <Text>{dictionary(item?.type)}</Text>,
                width: 80
              },
              {
                component: <Text>{item.itemNumber}</Text>,
                width: 50
              },
              {
                component: <Text>{item?.content}</Text>,
                width: 'rest'
              }
            ]}
          />
          // <View style={{ flexDirection: 'row', width: '100%' }}>
          //   <Text style={{ width: 100 }}>{item?.type} </Text>
          //   <Text style={{ width: 100 }}>{item?.content}</Text>
          // </View>
        )}
        rowsPerPage={10}
        data={movements}
        filters={[]}
      />
    </View>
  )
}

export const ScreenWorkshopE = (props) => (
  <ErrorBoundary componentName="ScreenWorkshop">
    <ScreenWorkshop {...props} />
  </ErrorBoundary>
)

export default ScreenWorkshop
