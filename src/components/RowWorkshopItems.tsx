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
  onRepairStart,
  onMarkQuoteAsDone
} from '../libs/order-actions'
import { useAuth } from '../contexts/authContext'
import { splitItems } from '../libs/workshop.libs'
import { ContactRow } from './OrderContacts'
import LinkLocation from './LinkLocation'
import { onChangeItemSection } from '../firebase/actions/item-actions'
import InputCheckbox from './InputCheckbox'
import asDate, { dateFormat } from '../libs/utils-date'
import {
  onWorkshopRepairFinish,
  onWorkshopRepairPending,
  onWorkshopRepairPickUp,
  onWorkshopRepairStart
} from '../firebase/actions/workshop-actions'
import { useState } from 'react'
import theme from '../theme'

export type RowWorkshopItemsProps = {
  items: Partial<ItemType>[]
  title?: string
  showScheduledTime?: boolean
  sortFunction?: (
    a: ItemExternalRepairProps,
    b: ItemExternalRepairProps
  ) => number
  onItemPress?: (item: Partial<ItemType['id']>) => void
  selectedItem?: Partial<ItemType['id']>
}
const RowWorkshopItems = ({
  items,
  title,
  showScheduledTime,
  sortFunction,
  onItemPress,
  selectedItem
}: RowWorkshopItemsProps) => {
  const sortByNumber = (
    a: ItemExternalRepairProps,
    b: ItemExternalRepairProps
  ) => parseFloat(a.number) - parseFloat(b.number)

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
        {items.sort(sortFunction || sortByNumber).map((item) => (
          <View
            key={item.id}
            style={{
              maxWidth: 100,
              width: '100%',
              marginRight: 2,
              marginBottom: 4
            }}
          >
            <WorkshopItem
              item={item}
              showScheduledTime={showScheduledTime}
              onItemPress={onItemPress}
              selectedItem={selectedItem}
            />
          </View>
        ))}
      </View>
    </View>
  )
}

const WorkshopItem = ({
  item,
  showScheduledTime,
  onItemPress,
  selectedItem
}: {
  item: Partial<ItemExternalRepairProps>
  showScheduledTime?: boolean
  onItemPress?: (item: Partial<ItemType['id']>) => void
  selectedItem?: Partial<ItemType['id']>
}) => {
  // is two types of items in the workshop. External repair and internal/rent repair
  // external items has isExternalRepair props and it should modify the order when an action is handle
  // it should provides a workshopStatus prop to know the status of the item ✅
  // item should provides a orderId props to know the order that is related to ✅

  const modal = useModal({
    title: `${item.isExternalRepair ? 'Reparación' : 'Renta'} ${
      item?.number || 'SN'
    }`
  })
  const { toItems, toOrders } = useMyNav()
  const { storeId } = useStore()
  const { user } = useAuth()
  const userId = user?.id

  const handlePickup = async ({ failDescription }) => {
    onWorkshopRepairPending({
      storeId,
      itemId: item.id,
      orderId: item.orderId,
      isExternalRepair: item.isExternalRepair,
      failDescription
    })
  }
  const handleStartRepair = () => {
    onWorkshopRepairStart({
      storeId,
      itemId: item.id,
      orderId: item.orderId,
      isExternalRepair: item.isExternalRepair
    })
  }

  const handleMarkAsPending = ({ failDescription }) => {
    modal.toggleOpen()
    onWorkshopRepairPickUp({
      storeId,
      itemId: item.id,
      orderId: item.orderId,
      isExternalRepair: item.isExternalRepair,
      failDescription
    })
  }
  const handleFinishRepair = () => {
    modal.toggleOpen()
    onWorkshopRepairFinish({
      storeId,
      itemId: item.id,
      orderId: item.orderId,
      isExternalRepair: item.isExternalRepair
    })
  }
  const handleBackToRepair = ({
    failDescription
  }: {
    failDescription: string
  }) => {
    modal.toggleOpen()
    onWorkshopRepairPickUp({
      storeId,
      itemId: item.id,
      orderId: item.orderId,
      failDescription,
      isExternalRepair: item.isExternalRepair
    })
    if (item.isExternalRepair) {
      // onRepairStart({
      //   orderId: item.orderId,
      //   userId,
      //   comment
      // })
    } else {
      //* this case is handled by the modalFixItem
    }
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

  const showBackToRepairOnceFinished =
    item.repairDetails.quotes.length > 0
      ? item.repairDetails.quotes?.some((q) => !q.doneAt)
      : true
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Pressable
        onPress={() => {
          onItemPress?.(item.id)
          console.log(item.id)
          modal.toggleOpen()
        }}
        style={{
          padding: 2,
          margin: 2,
          backgroundColor: selectedItem === item?.id ? theme.info : 'white',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
          width: '100%',
          height: '100%'
        }}
      >
        <CardItem
          item={item}
          showSerialNumber
          showScheduledTime={showScheduledTime}
          showRepairInfo
        />
      </Pressable>
      <StyledModal {...modal}>
        <CardItem
          item={item}
          showSerialNumber
          showFixNeeded
          showScheduledTime={showScheduledTime}
          showRepairInfo
        />
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
            <Text style={[{ marginBottom: 6 }, gStyles.tError]}>
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
                  <View
                    key={q.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      marginVertical: 4
                    }}
                  >
                    <InputCheckbox
                      disabled={item.workshopStatus !== 'inProgress'}
                      value={!!q.doneAt}
                      setValue={() => {
                        onMarkQuoteAsDone({
                          orderId: item.orderId,
                          quoteId: q.id
                        })
                      }}
                      label={`${q.description} ${
                        q.doneAt
                          ? dateFormat(asDate(q.doneAt), 'ddMMM HH:mm')
                          : ''
                      }`}
                    />
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {shouldPickup && (
          <View style={{ marginVertical: 8, width: '100%' }}>
            <Button
              label="Recoger"
              onPress={() => {
                handlePickup({ failDescription: item.repairInfo })
              }}
            ></Button>
          </View>
        )}
        {fixPending && (
          <View style={{ marginVertical: 8, width: '100%' }}>
            <Button
              label="Iniciar reparación"
              onPress={handleStartRepair}
            ></Button>
          </View>
        )}
        {fixInProgress && (
          <View>
            <View style={{ marginVertical: 8, width: '100%' }}>
              <Button
                label="Pendiente"
                onPress={() =>
                  handleMarkAsPending({
                    failDescription: item.repairInfo
                  })
                }
              ></Button>
            </View>
            <View style={{ marginVertical: 8, width: '100%' }}>
              {item.isExternalRepair ? (
                <>
                  {showBackToRepairOnceFinished && (
                    <Text style={[gStyles.tError, { marginBottom: 8 }]}>
                      *Faltan reparaciones por hacer
                    </Text>
                  )}
                  <Button
                    onPress={handleFinishRepair}
                    label="Lista para entregar"
                    disabled={showBackToRepairOnceFinished}
                  ></Button>
                </>
              ) : (
                <ModalFixItem
                  item={item}
                  disabled={false}
                  disabledFix={false}
                  handleFix={() => handleFinishRepair()}
                />
              )}
            </View>
          </View>
        )}
        {fixFinished && (
          <View style={{ marginVertical: 8, width: '100%' }}>
            <ModalFixItem
              item={item}
              disabled={false}
              disabledFix={false}
              handleFix={({ comment }) =>
                handleBackToRepair({ failDescription: comment })
              }
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
