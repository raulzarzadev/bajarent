import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { gStyles } from '../styles'
import { useStore } from '../contexts/storeContext'
import { useItemsCtx } from '../contexts/itemsContext'
import { RowWorkshopItemsE } from './RowWorkshopItems'
import asDate from '../libs/utils-date'
import ItemType from '../types/ItemType'
import ErrorBoundary from './ErrorBoundary'
import { formatItems, formatItemsFromRepair } from '../libs/workshop.libs'
import Divider from './Divider'
import { Switch } from 'react-native-elements'
import useMyNav from '../hooks/useMyNav'
import Button from './Button'

const ScreenWorkshop = () => {
  const { workshopItems, repairOrders } = useItemsCtx()
  const itemsPickedUp = workshopItems.filter(
    (item) => item.status === 'pickedUp'
  )
  const { toWorkshop } = useMyNav()
  const [itemPressed, setItemPressed] = useState<Partial<ItemType['id']>>()

  const { categories, storeSections } = useStore()
  const formattedItems = formatItems(itemsPickedUp, categories, storeSections)
  const formattedOrders = formatItemsFromRepair({
    repairOrders,
    categories,
    storeSections
  })

  //* <---- Rent items repairs
  const itemsPending = formattedItems.filter(
    (i) => (i.workshopStatus === 'pickedUp' || !i.workshopStatus) && i.needFix
  )

  const itemsInProgress = formattedItems.filter(
    (i) => i.workshopStatus === 'started'
  )

  const itemsFinished = formattedItems.filter(
    (i) => i.workshopStatus === 'finished' || !i.needFix
  )
  //* <---- External repairs
  const ordersShouldPickup = formattedOrders.filter(
    (i) => i.workshopStatus === 'pending' || !i.workshopStatus
  )

  const ordersPending = formattedOrders.filter(
    (i) => i.workshopStatus === 'pickedUp'
  )

  const ordersInProgress = formattedOrders.filter(
    (i) => i.workshopStatus === 'started'
  )

  const ordersFinished = formattedOrders.filter(
    (i) => i.workshopStatus === 'finished'
  )

  const [showRent, setShowRent] = useState(false)

  return (
    <ScrollView style={{ width: '100%', margin: 'auto' }}>
      <View style={{ maxWidth: 200, marginLeft: 'auto' }}>
        <Button
          variant="ghost"
          label="Movimientos"
          onPress={() => {
            toWorkshop()
          }}
        />
      </View>
      <View style={{ maxWidth: 800, marginHorizontal: 'auto', width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginBottom: 12
          }}
        >
          <Text style={[{ marginHorizontal: 4 }, gStyles.h2]}>
            {`(${formattedOrders.length}) `}Reparaciones
          </Text>
          <Switch onValueChange={setShowRent} value={showRent} />
          <Text style={[{ marginHorizontal: 4 }, gStyles.h2]}>
            De renta {`(${formattedItems.length}) `}
          </Text>
        </View>

        {showRent ? (
          <>
            <RepairStepE
              justShow={'rents'}
              title="Pendientes"
              rentItems={itemsPending}
              onItemPress={setItemPressed}
              selectedItem={itemPressed}
            />
            <RepairStepE
              justShow={'rents'}
              title="En reparación"
              rentItems={itemsInProgress}
              onItemPress={setItemPressed}
              selectedItem={itemPressed}
            />
            <RepairStepE
              justShow={'rents'}
              title="Listas para entrega"
              rentItems={itemsFinished}
              showScheduledTime
              onItemPress={setItemPressed}
              selectedItem={itemPressed}
            />
          </>
        ) : (
          <>
            <RepairStepE
              justShow={'repairs'}
              title="Pedidos"
              showScheduledTime
              repairItems={ordersShouldPickup}
              onItemPress={setItemPressed}
              selectedItem={itemPressed}
            />
            <RepairStepE
              justShow={'repairs'}
              title="En reparación"
              repairItems={[...ordersPending, ...ordersInProgress]}
              onItemPress={setItemPressed}
              selectedItem={itemPressed}
            />
            <RepairStepE
              justShow={'repairs'}
              title="Listas para entrega"
              repairItems={ordersFinished}
              showScheduledTime
              onItemPress={setItemPressed}
              selectedItem={itemPressed}
            />
          </>
        )}
      </View>
    </ScrollView>
  )
}

export type RepairStepProps = {
  title: string
  rentItems?: Partial<ItemType>[]
  repairItems?: Partial<ItemType>[]
  justShow?: 'rents' | 'repairs'
  showScheduledTime?: boolean
  onItemPress?: (id: string) => void
  selectedItem?: Partial<ItemType['id']>
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
  justShow,
  showScheduledTime,
  onItemPress,
  selectedItem
}: RepairStepProps) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ paddingLeft: 16 }}>
        {justShow === 'rents' && (
          <RowWorkshopItemsE
            items={rentItems}
            title={title}
            onItemPress={onItemPress}
            selectedItem={selectedItem}
          />
        )}
        {justShow === 'repairs' && (
          <RowWorkshopItemsE
            items={repairItems}
            title={title}
            showScheduledTime={showScheduledTime}
            sortFunction={(a, b) =>
              (asDate(a?.scheduledAt)?.getTime() || 0) -
              (asDate(b?.scheduledAt)?.getTime() || 0)
            }
            onItemPress={onItemPress}
            selectedItem={selectedItem}
          />
        )}
      </View>
      <Divider />
    </View>
  )
}

export const ScreenWorkshopE = (props) => (
  <ErrorBoundary componentName="ScreenWorkshop">
    <ScreenWorkshop {...props} />
  </ErrorBoundary>
)

export default ScreenWorkshop
