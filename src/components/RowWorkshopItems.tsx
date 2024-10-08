import { Pressable, View } from 'react-native'
import ItemType from '../types/ItemType'
import Button from './Button'
import CardItem from './CardItem'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useStore } from '../contexts/storeContext'
import InputAssignSection from './InputAssingSection'
import ModalFixItem from './ModalFixItem'
import { splitItems } from './ScreenWorkshop'
import useMyNav from '../hooks/useMyNav'
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
  const { toItems } = useMyNav()
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
  }
  const handleBackToRepair = () => {
    modal.toggleOpen()
  }
  const handleAssignToSection = async ({ sectionId, sectionName }) => {
    return await ServiceStoreItems.update({
      itemId: item.id,
      itemData: {
        assignedSection: sectionId,
        assignedSectionName: sectionName
      },
      storeId
    })
  }
  const { needFix, finished, inProgress } = splitItems({ items: [item] })

  const fixPending = needFix.find((i) => i.id === item.id)
  const fixInProgress = inProgress.find((i) => i.id === item.id)
  const fixFinished = finished.find((i) => i.id === item.id)

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
        <CardItem item={item} showFixNeeded />
        <Button
          variant="ghost"
          onPress={() => {
            modal.toggleOpen()
            toItems({ id: item.id })
          }}
          label="Detalles"
        ></Button>
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
