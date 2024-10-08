import { View, Text } from 'react-native'
import React from 'react'
import { gStyles } from '../styles'
import { formatItems } from '../contexts/employeeContext'
import { useStore } from '../contexts/storeContext'
import { useItemsCtx } from '../contexts/itemsContext'
import RowWorkshopItems from './RowWorkshopItems'

const ScreenWorkshop = () => {
  const { workshopItems } = useItemsCtx()
  const itemsPickedUp = workshopItems.filter(
    (item) => item.status === 'pickedUp'
  )

  const itemsNeedFix = itemsPickedUp.filter(
    (item) =>
      item.workshopStatus === 'pending' &&
      (item.needFix || item.workshopStatus === 'pending')
  )
  const itemsInProgress = itemsPickedUp.filter(
    (item) => item.workshopStatus === 'inProgress'
  )
  const itemsFinished = itemsPickedUp.filter(
    (item) =>
      item.workshopStatus === 'finished' ||
      (!item.workshopStatus && !item.needFix)
  )
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
    <View>
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
    </View>
  )
}

export default ScreenWorkshop
