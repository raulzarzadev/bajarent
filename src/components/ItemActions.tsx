import { Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import ButtonConfirm from './ButtonConfirm'
import InputRadios from './InputRadios'
import { onChangeItemSection } from '../firebase/actions/item-actions'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import useMyNav from '../hooks/useMyNav'
import InputTextStyled from './InputTextStyled'
import ButtonDeleteItem from './ButtonDeleteItem'

type Actions =
  | 'details'
  | 'rent'
  | 'assign'
  | 'fix'
  | 'select'
  | 'delete'
  | 'edit'

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
  const itemSection = item?.assignedSection
  const needFix = item?.needFix
  const { storeSections, storeId } = useStore()
  const [sectionId, setSectionId] = React.useState<string | null>(
    itemSection || null
  )
  const currentSection = storeSections.find(
    ({ id }) => id === itemSection
  )?.name
  const handleChangeItemSection = async () => {
    return await onChangeItemSection({
      storeId,
      itemId,
      sectionId,
      sectionName: storeSections.find(({ id }) => id === sectionId)?.name
    })
  }
  const handleMarkAsNeedFix = async () => {
    ServiceStoreItems.updateField({
      storeId,
      itemId,
      field: 'needFix',
      value: !needFix
    })

    ServiceStoreItems.addEntry({
      storeId,
      itemId,
      entry: {
        type: needFix ? 'fix' : 'report',
        content: needFix ? `${comment}` : `${comment}`
      }
    })

    setComment('')
  }

  const [comment, setComment] = React.useState('')

  const { toItems } = useMyNav()

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap'
        }}
      >
        {actions.includes('delete') && (
          <ButtonDeleteItem
            itemId={item.id}
            onDeleted={() => {
              onAction?.('delete')
            }}
          />
        )}
        {actions.includes('edit') && (
          <Button
            onPress={() => {
              toItems({ id: itemId, screenEdit: true })
            }}
            variant="outline"
            // justIcon
            color="primary"
            icon="edit"
          />
        )}
        {actions?.includes('select') && (
          <Button
            label="Selecciona"
            onPress={() => {
              onAction?.('select')
            }}
          />
        )}
        {actions?.includes('details') && (
          <Button
            label="Detalles"
            onPress={() => {
              onAction?.('details')
              toItems({ id: itemId })
            }}
          />
        )}

        {actions?.includes('assign') && (
          <ButtonConfirm
            openLabel={currentSection || 'Asignar'}
            icon="swap"
            openVariant="outline"
            confirmLabel="Cambiar"
            handleConfirm={async () => {
              onAction?.('assign')
              return await handleChangeItemSection()
            }}
          >
            <InputRadios
              layout="row"
              label="Selecciona una area"
              setValue={(sectionId) => {
                setSectionId(sectionId)
              }}
              value={sectionId}
              options={storeSections.map(({ id, name }) => {
                return {
                  label: name,
                  value: id
                }
              })}
            />
          </ButtonConfirm>
        )}

        {actions.includes('fix') && (
          <>
            {needFix ? (
              <ButtonConfirm
                icon="wrench"
                openColor={'error'}
                openVariant={'filled'}
                handleConfirm={async () => {
                  onAction?.('fix')
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
                icon="wrench"
                openColor={'primary'}
                openVariant={'outline'}
                handleConfirm={async () => {
                  onAction?.('fix')
                  return await handleMarkAsNeedFix()
                }}
                confirmColor="error"
              >
                <Text style={gStyles.h3}>Necesita reparación</Text>
                <InputTextStyled
                  style={{ marginVertical: 6 }}
                  placeholder="Descripción"
                  label="Descripción"
                  onChangeText={(value) => setComment(value)}
                ></InputTextStyled>
              </ButtonConfirm>
            )}
          </>
        )}
      </View>
    </View>
  )
}

export default ItemActions
