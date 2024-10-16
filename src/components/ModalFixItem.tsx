import { View, Text } from 'react-native'
import React from 'react'
import ButtonConfirm from './ButtonConfirm'
import InputTextStyled from './InputTextStyled'
import { gStyles } from '../styles'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import { useStore } from '../contexts/storeContext'
import ItemType from '../types/ItemType'

export type HandleFixProps = {
  comment: string
}
const ModalFixItem = ({
  item,
  disabled,
  disabledFix,
  handleFix
}: {
  item: Partial<ItemType>
  disabled?: boolean
  disabledFix?: boolean
  handleFix?: (handleFixProps?: HandleFixProps) => void
}) => {
  const needFix = item?.needFix

  const { storeId } = useStore()
  const [comment, setComment] = React.useState('')
  const handleMarkAsNeedFix = async () => {
    if (item.isExternalRepair) {
      handleFix?.({ comment })
      setComment('')
    } else {
      await markItemAsNeedFix({
        itemId: item.id,
        storeId,
        needsFix: !needFix,
        comment
      })
      handleFix?.({ comment })
      setComment('')
    }
  }

  return (
    <View>
      <View style={{ margin: 2 }}>
        {!!needFix ? (
          <ButtonConfirm
            openDisabled={disabled || disabledFix}
            icon="wrench"
            openColor={'error'}
            openVariant={'filled'}
            modalTitle="Descripción de reparación"
            handleConfirm={async () => {
              return await handleMarkAsNeedFix()
            }}
          >
            <Text style={gStyles.h3}>Reparada</Text>
            <InputTextStyled
              style={{ marginVertical: 6 }}
              placeholder="Descripción"
              label="Descripción"
              onChangeText={(value) => setComment(value)}
            ></InputTextStyled>
          </ButtonConfirm>
        ) : (
          <ButtonConfirm
            openDisabled={disabled || disabledFix}
            icon="wrench"
            openColor={'primary'}
            openVariant={'outline'}
            handleConfirm={async () => {
              return await handleMarkAsNeedFix()
            }}
            confirmColor="error"
            modalTitle="Describe de la falla"
          >
            <InputTextStyled
              style={{ marginVertical: 6 }}
              placeholder="Descripción"
              label="Descripción"
              onChangeText={(value) => setComment(value)}
            ></InputTextStyled>
          </ButtonConfirm>
        )}
      </View>
    </View>
  )
}

export const markItemAsNeedFix = async ({
  itemId,
  storeId,
  needsFix, // it needs fix or it has been fixed ?
  comment,
  markAsRepairing
}: {
  itemId: string
  storeId: string
  needsFix: boolean
  comment: string
  markAsRepairing?: boolean
}) => {
  try {
    await ServiceStoreItems.update({
      itemId,
      storeId,
      itemData: {
        needFix: needsFix,
        workshopStatus: markAsRepairing
          ? 'inProgress'
          : needsFix
          ? 'pending'
          : 'finished'
      }
    })

    await ServiceStoreItems.addEntry({
      storeId,
      itemId,
      entry: {
        type: !needsFix ? 'fix' : 'report',
        content: comment,
        itemId
      }
    })
    return
  } catch (error) {
    console.log('error', error)
    return
  }
}

export default ModalFixItem
