import { FlatList, Pressable, View } from 'react-native'
import ItemType from '../types/ItemType'
import Button from './Button'
import CardItem from './CardItem'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useStore } from '../contexts/storeContext'
import InputAssignSection from './InputAssingSection'
import { useState } from 'react'
import ModalFixItem, { markItemAsNeedFix } from './ModalFixItem'
export type RowWorkshopItemsProps = {
  items: Partial<ItemType>[]
}
const RowWorkshopItems = ({ items }: RowWorkshopItemsProps) => {
  const sortByNumber = (a: ItemType, b: ItemType) =>
    parseFloat(a.number) - parseFloat(b.number)

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          minHeight: 74
        }
      ]}
    >
      {items.sort(sortByNumber).map((item) => (
        <WorkshopItem key={item.id} item={item} />
      ))}
    </View>
  )
}

const WorkshopItem = ({ item }: { item: Partial<ItemType> }) => {
  const modal = useModal({ title: `Acciones de ${item?.number || 'SN'}` })
  const [text, setText] = useState('')
  const { storeId } = useStore()
  const handleStartRepair = () => {
    modal.toggleOpen()
    ServiceStoreItems.update({
      itemId: item.id,
      itemData: { workshopStatus: 'inProgress' },
      storeId
    })
  }

  const handleMarkAsPending = () => {
    modal.toggleOpen()
    ServiceStoreItems.update({
      itemId: item.id,
      itemData: { workshopStatus: 'pending' },
      storeId
    })
  }
  const handleFinishRepair = () => {
    modal.toggleOpen()
    markItemAsNeedFix({
      itemId: item.id,
      storeId,
      needsFix: false,
      comment: text
    })

    setText('')
  }
  const handleBackToRepair = () => {
    modal.toggleOpen()
    markItemAsNeedFix({
      itemId: item.id,
      storeId,
      needsFix: true,
      comment: text,
      markAsRepairing: true
    })
    setText('')
  }

  const fixPending =
    item.workshopStatus === 'pending' &&
    (item.needFix || item.workshopStatus === 'pending')
  const fixInProgress = item?.workshopStatus === 'inProgress'
  const fixFinished = item?.workshopStatus === 'finished'

  return (
    <View>
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
          elevation: 3
        }}
      >
        <CardItem item={item} />
      </Pressable>
      <StyledModal {...modal}>
        {fixPending && (
          <Button
            label="Comenzar reparación"
            onPress={handleStartRepair}
          ></Button>
        )}
        {fixInProgress && (
          <View>
            <Button label="Pendiente" onPress={handleMarkAsPending}></Button>
            <ModalFixItem
              item={item}
              disabled={false}
              disabledFix={false}
              handleFix={() => handleFinishRepair()}
            />
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

            <InputAssignSection />
          </View>
        )}
      </StyledModal>
    </View>
  )
}
export default RowWorkshopItems
