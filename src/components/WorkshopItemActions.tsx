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
import InputAssignSection from './InputAssingSection'
import { onAssignOrder } from '../libs/order-actions'
import { onChangeItemSection } from '../firebase/actions/item-actions'

const WorkshopItemActions = ({
  item
}: {
  item: Partial<ItemExternalRepairProps>
}) => {
  const workshopStatus = item?.workshopStatus
  const failDescription =
    item?.repairDetails?.failDescription || item?.repairInfo || ''
  const { storeId } = useStore()
  const { user } = useAuth()

  const isExternalRepair = item?.isExternalRepair
  const handleAssignToSection = async ({ sectionId, sectionName }) => {
    if (item.isExternalRepair) {
      return await onAssignOrder({
        orderId: item.orderId,
        sectionId,
        sectionName,
        storeId,
        fromSectionName: 'Taller'
      })
    } else {
      return await onChangeItemSection({
        storeId,
        itemId: item.id,
        sectionId,
        sectionName,
        fromSectionId: 'workshop'
      })
    }
  }
  if (workshopStatus === workshop_status.pending) {
    //* this should move to picked up

    return (
      <View style={{ marginVertical: 8, width: '100%' }}>
        <Button
          label="Recoger"
          onPress={() => {
            onWorkshopRepairPickUp({
              storeId,
              itemId: item?.id,
              orderId: item?.orderId,
              isExternalRepair: item?.isExternalRepair,
              failDescription,
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
              failDescription,
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
              isExternalRepair: item?.isExternalRepair,
              failDescription,
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
              failDescription,
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
              failDescription,
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
              failDescription,
              userId: user?.id
            })
          }}
        ></Button>

        <View style={{ marginVertical: 8, width: '100%' }}>
          <InputAssignSection
            setNewSection={async ({ sectionId, sectionName }) => {
              try {
                await handleAssignToSection({ sectionId, sectionName })
              } catch (error) {
                console.log('error', error)
              }
              return
            }}
          />
        </View>

        {isExternalRepair && (
          <View style={{ marginVertical: 8, width: '100%' }}>
            <Button
              label="Entregar "
              onPress={() => {
                onWorkshopDeliveryRepair({
                  storeId,
                  itemId: item.id,
                  orderId: item.orderId,
                  isExternalRepair: !!item.isExternalRepair,
                  failDescription,
                  userId: user?.id
                })
              }}
            ></Button>
          </View>
        )}
      </View>
    )
  }
}

export default WorkshopItemActions
