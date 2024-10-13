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
import { Switch } from 'react-native-elements'

const ScreenWorkshop = () => {
  const { workshopItems, repairOrders } = useItemsCtx()

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

  const [showRent, setShowRent] = useState(true)

  return (
    <ScrollView style={{ maxWidth: 800, width: '100%', margin: 'auto' }}>
      <View style={{ maxWidth: 200, marginLeft: 'auto' }}>
        <ModalViewMovements />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginBottom: 12
        }}
      >
        <Text style={[{ marginHorizontal: 4 }, gStyles.h2]}>Reparaciones</Text>
        <Switch onValueChange={setShowRent} value={showRent} />
        <Text style={[{ marginHorizontal: 4 }, gStyles.h2]}>De renta</Text>
      </View>
      {!showRent && (
        <RepairStepE
          justShow={'repairs'}
          title="Por recoger"
          repairItems={shouldPickup}
        />
      )}

      <RepairStepE
        justShow={showRent ? 'rents' : 'repairs'}
        title="Pendientes"
        rentItems={formattedPendingItems}
        repairItems={repairNeedFix}
      />

      <RepairStepE
        justShow={showRent ? 'rents' : 'repairs'}
        title="En reparación"
        rentItems={formattedInProgressItems}
        repairItems={repairInProgress}
      />

      <RepairStepE
        justShow={showRent ? 'rents' : 'repairs'}
        title="Listas para entrega"
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
  justShow?: 'rents' | 'repairs'
}
export const RepairStepE = (props: RepairStepProps) => (
  <ErrorBoundary componentName="RepairStep">
    <RepairStep {...props} />
  </ErrorBoundary>
)
const RepairStep = ({
  title,
  rentItems = [],
  repairItems = [],
  justShow
}: RepairStepProps) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ paddingLeft: 16 }}>
        {justShow === 'rents' && (
          <RowWorkshopItems items={rentItems} title={title} />
        )}
        {justShow === 'repairs' && (
          <RowWorkshopItems items={repairItems} title={title} />
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
