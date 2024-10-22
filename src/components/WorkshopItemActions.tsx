import { View } from 'react-native'
import React from 'react'
import { workshop_status } from '../types/WorkshopType'
import Button from './Button'
import {
  onWorkshopDeliveryRepair,
  onWorkshopRepairFinish,
  onWorkshopRepairPending,
  onWorkshopRepairPickUp,
  onWorkshopRepairStart
} from '../firebase/actions/workshop-actions'
import { ItemExternalRepairProps } from '../types/ItemType'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'

const WorkshopItemActions = ({
  item
}: {
  item: Partial<ItemExternalRepairProps>
}) => {
  const workshopStatus = item?.workshopStatus
  const { storeId } = useStore()
  const { user } = useAuth()
  if (workshopStatus === workshop_status.pending) {
    //* this should move to picked up
    return (
      <View style={{ marginVertical: 8, width: '100%' }}>
        <Button
          label="Recoger"
          onPress={() => {
            onWorkshopRepairPickUp({
              storeId,
              itemId: item.id,
              orderId: item.orderId,
              isExternalRepair: item.isExternalRepair,
              failDescription:
                item.repairDetails.failDescription || item.repairInfo || '',
              userId: user.id
            })
          }}
        ></Button>
      </View>
    )
  }
  if (workshopStatus === workshop_status.pickedUp) {
    //* this should move to finished
    return (
      <View style={{ marginVertical: 8, width: '100%' }}>
        <Button
          label="Regresar al cliente"
          variant="ghost"
          onPress={() => {
            onWorkshopRepairPending({
              storeId,
              itemId: item.id,
              orderId: item.orderId,
              isExternalRepair: item.isExternalRepair,
              failDescription:
                item.repairDetails.failDescription || item.repairInfo || '',
              userId: user.id
            })
          }}
        ></Button>
        <Button
          label="Iniciar reparación"
          onPress={() => {
            onWorkshopRepairStart({
              storeId,
              itemId: item.id,
              orderId: item.orderId,
              isExternalRepair: item.isExternalRepair,
              failDescription:
                item.repairDetails.failDescription || item.repairInfo || '',
              userId: user?.id
            })
          }}
        ></Button>
      </View>
    )
  }
  if (workshopStatus === workshop_status.started) {
    //* this should move back to inProgress
    return (
      <View style={{ marginVertical: 8, width: '100%' }}>
        <Button
          label="Pendiente"
          variant="ghost"
          // icon='arrowForward'
          onPress={() => {
            onWorkshopRepairPickUp({
              storeId,
              itemId: item.id,
              orderId: item.orderId,
              isExternalRepair: item.isExternalRepair,
              failDescription:
                item.repairDetails.failDescription || item.repairInfo || '',
              userId: user.id
            })
          }}
        ></Button>
        <Button
          label="Terminar reparación"
          onPress={() => {
            onWorkshopRepairFinish({
              storeId,
              itemId: item.id,
              orderId: item.orderId,
              isExternalRepair: item.isExternalRepair,
              failDescription:
                item.repairDetails.failDescription || item.repairInfo || '',
              userId: user?.id
            })
          }}
        ></Button>
      </View>
    )
  }
  if (workshopStatus === workshop_status.finished) {
    //* this should move back to inProgress
    return (
      <View style={{ marginVertical: 8, width: '100%' }}>
        <Button
          variant="ghost"
          label="Regresar a reparación"
          onPress={() => {
            onWorkshopRepairStart({
              storeId,
              itemId: item.id,
              orderId: item.orderId,
              isExternalRepair: item.isExternalRepair,
              failDescription:
                item.repairDetails.failDescription || item.repairInfo || '',
              userId: user?.id
            })
          }}
        ></Button>
        <Button
          label="Entregar "
          onPress={() => {
            onWorkshopDeliveryRepair({
              storeId,
              itemId: item.id,
              orderId: item.orderId,
              isExternalRepair: !!item.isExternalRepair,
              failDescription:
                item.repairDetails.failDescription || item.repairInfo || '',
              userId: user?.id
            })
          }}
        ></Button>
      </View>
    )
  }
}

export default WorkshopItemActions
