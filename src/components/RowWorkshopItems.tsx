import { Pressable, Text, View } from 'react-native'
import ItemType, { ItemExternalRepairProps } from '../types/ItemType'
import Button from './Button'
import CardItem from './CardItem'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useStore } from '../contexts/storeContext'
import InputAssignSection from './InputAssingSection'
import ModalFixItem from './ModalFixItem'

import useMyNav from '../hooks/useMyNav'

import { gStyles } from '../styles'
import { ServiceOrders } from '../firebase/ServiceOrders'
import {
  onAssignOrder,
  onRepairFinish,
  onRepairStart
} from '../libs/order-actions'
import { useAuth } from '../contexts/authContext'
import { splitItems } from '../libs/workshop.libs'
import { ContactRow } from './OrderContacts'
import LinkLocation from './LinkLocation'
import { onChangeItemSection } from '../firebase/actions/item-actions'
export type RowWorkshopItemsProps = {
  items: Partial<ItemType>[]
  title?: string
}
const RowWorkshopItems = ({ items, title }: RowWorkshopItemsProps) => {
  const sortByNumber = (a: ItemType, b: ItemType) =>
    parseFloat(a.number) - parseFloat(b.number)

  return (
    <View>
      <Text style={[gStyles.h2, { textAlign: 'left' }]}>
        {title} {`(${items.length || 0})`}
      </Text>
      <View
        style={[
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            minHeight: 74
          }
        ]}
      >
        {items.sort(sortByNumber).map((item) => (
          <View
            key={item.id}
            style={{ maxWidth: 90, width: '100%', marginRight: 2 }}
          >
            <WorkshopItem item={item} />
          </View>
        ))}
      </View>
    </View>
  )
}

const WorkshopItem = ({ item }: { item: Partial<ItemExternalRepairProps> }) => {
  // is two types of items in the workshop. External repair and internal/rent repair
  // external items has isExternalRepair props and it should modify the order when an action is handle
  // it should provides a workshopStatus prop to know the status of the item ✅
  // item should provides a orderId props to know the order that is related to ✅

  const modal = useModal({
    title: `${item.isExternalRepair ? 'Reparacion' : 'Renta'} ${
      item?.number || 'SN'
    }`
  })
  const { toItems, toOrders } = useMyNav()
  const { storeId } = useStore()
  const { user } = useAuth()
  const userId = user?.id

  const handlePickup = async () => {
    modal.toggleOpen()
    if (item.isExternalRepair) {
      onRepairStart({ orderId: item.orderId, userId })
    }
  }
  const handleStartRepair = () => {
    modal.toggleOpen()
    if (item.isExternalRepair) {
      ServiceOrders.update(item.orderId, {
        workshopStatus: 'inProgress'
      })
    } else {
      ServiceStoreItems.update({
        itemId: item.id,
        itemData: { workshopStatus: 'inProgress' },
        storeId
      })
    }
  }

  const handleMarkAsPending = () => {
    modal.toggleOpen()
    if (item.isExternalRepair) {
      ServiceOrders.update(item.orderId, {
        workshopStatus: 'pending'
      })
    } else {
      ServiceStoreItems.update({
        itemId: item.id,
        itemData: { workshopStatus: 'pending' },
        storeId
      })
    }
  }
  const handleFinishRepair = () => {
    if (item.isExternalRepair) {
      ServiceOrders.update(item.orderId, {
        workshopStatus: 'finished'
      })
      onRepairFinish({ orderId: item.orderId, userId })
    }
    modal.toggleOpen()
  }
  const handleBackToRepair = () => {
    modal.toggleOpen()
  }
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
  const { needFix, finished, inProgress } = splitItems({ items: [item] })

  const fixPending = needFix.find((i) => i.id === item.id)
  const fixInProgress = inProgress.find((i) => i.id === item.id)
  const fixFinished = finished.find((i) => i.id === item.id)
  const shouldPickup = item.workshopStatus === 'shouldPickup'
  return (
    <View style={{ width: '100%' }}>
      <Pressable
        onPress={modal.toggleOpen}
        style={{
          padding: 2,
          margin: 2,
          backgroundColor: 'white',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          width: '100%'
        }}
      >
        <CardItem item={item} showSerialNumber />
      </Pressable>
      <StyledModal {...modal}>
        <CardItem item={item} showSerialNumber />
        {!!item?.isExternalRepair && (
          <View style={{ marginVertical: 16 }}>
            <View>
              <View style={{ marginBottom: 6 }}>
                <Text style={[gStyles.h3, { textAlign: 'left' }]}>
                  Cliente:
                </Text>
                <Text>{item?.repairDetails?.clientName}</Text>
              </View>
              <View style={{ marginBottom: 6 }}>
                <Text style={[gStyles.h3, { textAlign: 'left' }]}>
                  Dirección:
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  {!!item.repairDetails.location && (
                    <LinkLocation location={item.repairDetails.location} />
                  )}
                  <Text>{item?.repairDetails?.address}</Text>
                </View>
              </View>

              <View style={{ marginBottom: 6 }}>
                <Text style={[gStyles.h3, { textAlign: 'left' }]}>
                  Contactos:
                </Text>
                {item?.repairDetails?.contacts?.map((contact, i) => (
                  <ContactRow contact={contact} key={i} />
                ))}
              </View>
            </View>
            <Text style={[gStyles.h3, { textAlign: 'left' }]}>Falla:</Text>
            <Text style={{ marginBottom: 6 }}>
              {item?.repairDetails?.failDescription}
            </Text>
            <View>
              {item?.repairDetails?.quotes?.length > 0 && (
                <Text style={[gStyles.h3, { textAlign: 'left', marginTop: 6 }]}>
                  Reparaciones autorizadas:
                </Text>
              )}
              {item?.repairDetails?.quotes?.map((q) => {
                return (
                  <Text style={{ marginVertical: 2 }} key={q.id}>
                    {q.description}
                  </Text>
                )
              })}
            </View>
          </View>
        )}

        <Button
          variant="ghost"
          onPress={() => {
            modal.toggleOpen()

            if (item.isExternalRepair) {
              toOrders({ id: item.orderId })
            } else {
              toItems({ id: item.id })
            }
          }}
          label="Detalles"
        ></Button>
        {shouldPickup && (
          <Button
            label="Recoger"
            onPress={() => {
              handlePickup()
            }}
          ></Button>
        )}

        {fixPending && (
          <Button
            label="Comenzar reparación"
            onPress={handleStartRepair}
          ></Button>
        )}
        {fixInProgress && (
          <View>
            <Button label="Pendiente" onPress={handleMarkAsPending}></Button>
            {item.isExternalRepair ? (
              <Button
                onPress={handleFinishRepair}
                label="Lista para entregar"
              ></Button>
            ) : (
              <ModalFixItem
                item={item}
                disabled={false}
                disabledFix={false}
                handleFix={() => handleFinishRepair()}
              />
            )}
          </View>
        )}
        {fixFinished && (
          <View>
            <ModalFixItem
              item={item}
              disabled={false}
              disabledFix={false}
              handleFix={() => handleBackToRepair()}
            />

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
        )}
      </StyledModal>
    </View>
  )
}
export default RowWorkshopItems
