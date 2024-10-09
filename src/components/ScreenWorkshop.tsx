import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { gStyles } from '../styles'
import { formatItems } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import { useItemsCtx } from '../contexts/itemsContext'
import RowWorkshopItems from './RowWorkshopItems'
import HeaderDate from './HeaderDate'
import { ServiceItemHistory } from '../firebase/ServiceItemHistory'
import asDate, { dateFormat, endDate, startDate } from '../libs/utils-date'
import List from './List'
import RowItem from './RowItem'
import ListRow from './ListRow'
import dictionary from '../dictionary'
import useMyNav from '../hooks/useMyNav'
import Button from './Button'
import useModal from '../hooks/useModal'
import StyledModal from './StyledModal'
import ItemType from '../types/ItemType'

const ScreenWorkshop = () => {
  const { workshopItems } = useItemsCtx()
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
  return (
    <ScrollView>
      <View style={{ maxWidth: 200, marginLeft: 'auto' }}>
        <ModalViewMovements />
      </View>
      <Text style={gStyles.h1}>Taller</Text>
      <Text style={[gStyles.h2, { textAlign: 'left' }]}>
        Pendientes {`(${formattedPendingItems?.length || 0})`}
      </Text>
      <RowWorkshopItems items={formattedPendingItems} />
      <Text style={[gStyles.h2, { textAlign: 'left' }]}>
        En Reparación {`(${formattedInProgressItems?.length || 0})`}
      </Text>
      <RowWorkshopItems items={formattedInProgressItems} />
      <Text style={[gStyles.h2, { textAlign: 'left' }]}>
        Terminadas {`(${formattedFinishedItems?.length || 0})`}
      </Text>
      <RowWorkshopItems items={formattedFinishedItems} />
    </ScrollView>
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

export const splitItems = ({ items = [] }: { items: Partial<ItemType>[] }) => {
  if (!items.length)
    return {
      needFix: [],
      inProgress: [],
      finished: []
    }
  const needFix = items.filter(
    (item) => item.needFix && item.workshopStatus !== 'inProgress'
  )
  const inProgress = items.filter(
    (item) => item.workshopStatus === 'inProgress'
  )
  const finished = items.filter(
    (item) => !item.needFix || item.workshopStatus === 'finished'
  )
  return {
    needFix,
    inProgress,
    finished
  }
}

export default ScreenWorkshop
