import { Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import ButtonConfirm from './ButtonConfirm'
import InputRadios from './InputRadios'
import {
  onChangeItemSection,
  onCheckInInventory,
  onReactiveItem,
  onRetireItem
} from '../firebase/actions/item-actions'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import useMyNav from '../hooks/useMyNav'
import InputTextStyled from './InputTextStyled'
import ButtonDeleteItem from './ButtonDeleteItem'
import { useAuth } from '../contexts/authContext'
import { isToday } from 'date-fns'
import asDate, { dateFormat } from '../libs/utils-date'
import Icon from './Icon'
import theme from '../theme'
import SpanUser from './SpanUser'
import CardItem, { SquareItem } from './CardItem'
import ModalFixItem from './ModalFixItem'
import InputAssignSection from './InputAssingSection'

type Actions =
  | 'details'
  | 'rent'
  | 'assign'
  | 'fix'
  | 'select'
  | 'delete'
  | 'edit'
  | 'retire'
  | 'history'
  | 'inventory'

const ItemActions = ({
  item,
  onAction,
  actions = []
}: {
  item: Partial<ItemType>
  onAction?: (action: Actions) => void
  actions?: Array<Actions>
}) => {
  const itemId = item?.id
  const itemSection = item?.assignedSection || ''
  const checkedInventoryToday = isToday(asDate(item?.lastInventoryAt))
  const { storeSections, storeId } = useStore()

  const { user } = useAuth()
  const [sectionId, setSectionId] = React.useState<string | null>(
    itemSection || null
  )
  const currentSection = storeSections.find(
    ({ id }) => id === itemSection
  )?.name
  const handleChangeItemSection = async ({ sectionId }) => {
    return await onChangeItemSection({
      storeId,
      itemId,
      sectionId,
      sectionName: storeSections.find(({ id }) => id === sectionId)?.name
    })
  }

  const handleAddItemEntry = async () => {
    ServiceStoreItems.addEntry({
      storeId,
      itemId,
      entry: {
        type: 'custom',
        content: `${comment}`,
        itemId
      }
    })
    setComment('')
  }

  const handleAddInventoryEntry = async () => {
    await onCheckInInventory({ storeId, itemId, userId: user?.id })
  }

  const [comment, setComment] = React.useState('')
  const [disabled, setDisabled] = React.useState(false)
  const { toItems } = useMyNav()
  const retiredItem = item?.status === 'retired'
  const rentedItem = item?.status === 'rented'
  const disabledFix = item?.status === 'retired'
  const disabledAssign = item?.status === 'retired'
  const disabledDelete = item?.status === 'retired'
  const disabledEdit = item?.status === 'retired'
  const disabledHistory = item?.status === 'retired'
  const disabledInventory = item?.status === 'retired'
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap'
        }}
      >
        {actions.includes('retire') && (
          <View style={{ margin: 2 }}>
            <ButtonConfirm
              openDisabled={disabled || rentedItem}
              icon={retiredItem ? 'upload' : 'download'}
              openVariant={!retiredItem ? 'outline' : 'filled'}
              text={`${retiredItem ? 'Reactivar' : 'Dar de baja'}`}
              handleConfirm={async () => {
                setDisabled(true)
                if (retiredItem) {
                  onReactiveItem({ itemId, storeId })
                } else {
                  onRetireItem({ itemId, storeId, userId: user.id })
                }
                setDisabled(false)
                return
              }}
            />
          </View>
        )}
        {actions.includes('delete') && (
          <View style={{ margin: 2 }}>
            <ButtonDeleteItem
              disabled={disabled || disabledDelete}
              itemId={item.id}
              onDeleted={() => {
                onAction?.('delete')
              }}
            />
          </View>
        )}
        {actions.includes('edit') && (
          <View style={{ margin: 2 }}>
            <Button
              disabled={disabled || disabledEdit}
              onPress={() => {
                toItems({ id: itemId, screenEdit: true })
              }}
              variant="outline"
              // justIcon
              color="primary"
              icon="edit"
            />
          </View>
        )}
        {actions?.includes('select') && (
          <View style={{ margin: 2 }}>
            <Button
              label="Selecciona"
              onPress={() => {
                onAction?.('select')
              }}
            />
          </View>
        )}
        {actions?.includes('details') && (
          <View style={{ margin: 2 }}>
            <Button
              label="Detalles"
              onPress={() => {
                onAction?.('details')
                toItems({ id: itemId })
              }}
            />
          </View>
        )}

        {actions?.includes('assign') && (
          <View style={{ margin: 2 }}>
            <InputAssignSection
              disabled={disabled || disabledAssign}
              currentSection={sectionId}
              setNewSection={async ({ sectionId }) => {
                setSectionId(sectionId)
                onAction?.('assign')
                return await handleChangeItemSection({ sectionId })
              }}
            />
          </View>
        )}

        {actions?.includes('history') && (
          <View style={{ margin: 2 }}>
            <ButtonConfirm
              openDisabled={disabled || disabledHistory}
              icon="history"
              modalTitle="Agregar historial"
              openVariant="outline"
              confirmLabel="Agregar"
              handleConfirm={async () => {
                handleAddItemEntry()
              }}
            >
              <Text style={gStyles.h3}>Historial</Text>
              <InputTextStyled
                style={{ marginVertical: 6 }}
                placeholder="Descripción"
                label="Descripción"
                onChangeText={(value) => setComment(value)}
              ></InputTextStyled>
            </ButtonConfirm>
          </View>
        )}

        {actions?.includes('inventory') && (
          <View style={{ margin: 2 }}>
            <ButtonConfirm
              openDisabled={disabled || disabledInventory}
              modalTitle="Verificar inventario"
              icon="inventory"
              openVariant={checkedInventoryToday ? 'filled' : 'outline'}
              openColor={checkedInventoryToday ? 'success' : 'primary'}
              handleConfirm={async () => {
                return handleAddInventoryEntry()
              }}

              //* TODO: if the invletory was don today should be a green filled button
            >
              {checkedInventoryToday && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 8
                  }}
                >
                  <Icon icon="inventory" color={theme.success} />
                  <Text style={{ textAlign: 'center' }}>
                    Ya fue verificado HOY a las{' '}
                    {dateFormat(asDate(item.lastInventoryAt), 'HH:mm')}hrs por{' '}
                    <SpanUser userId={item?.lastInventoryBy} />
                  </Text>
                </View>
              )}
              <Text style={gStyles.h3}>
                Verifica que este elemento realmente existe, tiene los datos
                correctos y está en en el sitio indicado.
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  margin: 'auto',
                  marginVertical: 16
                }}
              >
                <SquareItem item={item} showAssignedSection showSerialNumber />
              </View>
            </ButtonConfirm>
          </View>
        )}

        {actions.includes('fix') && (
          <ModalFixItem
            item={item}
            disabled={disabled}
            disabledFix={disabledFix}
          />
        )}
      </View>
    </View>
  )
}

export default ItemActions
