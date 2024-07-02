import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import ButtonConfirm from './ButtonConfirm'
import InputRadios from './InputRadios'
import { onChangeItemSection } from '../firebase/actions/item-actions'
import { useNavigation } from '@react-navigation/native'
import { ServiceStoreItems } from '../firebase/ServiceStoreItems'
import ItemType from '../types/ItemType'
import { gStyles } from '../styles'
import useMyNav from '../hooks/useMyNav'
import InputTextStyled from './InputTextStyled'

const ItemActions = ({
  item,
  onAction
}: {
  item: Partial<ItemType>
  onAction: (action: 'details' | 'rent' | 'assign' | 'fix') => void
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
        content: needFix ? `Reparar: ${comment}` : `Reparada : ${comment}`
      }
    })

    setComment('')
  }

  const [comment, setComment] = React.useState('')

  const { toItems, toOrders } = useMyNav()
  return (
    <View>
      <View style={{ justifyContent: 'center', margin: 'auto' }}></View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap'
        }}
      >
        <Button
          label="Detalles"
          onPress={() => {
            onAction('details')
            toItems({ id: itemId })
          }}
        />
        <Button
          label="Rentar"
          onPress={() => {
            onAction('rent')
            toOrders({ screenNew: true })

            console.log('redirigir a nueva orden que incluya este item')
          }}
        />
        <ButtonConfirm
          openLabel={currentSection || 'Asignar'}
          icon="swap"
          openVariant="outline"
          confirmLabel="Cambiar"
          handleConfirm={async () => {
            onAction('assign')
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
        {needFix ? (
          <ButtonConfirm
            icon="wrench"
            openColor={'error'}
            openVariant={'filled'}
            handleConfirm={async () => {
              onAction('fix')
              return await handleMarkAsNeedFix()
            }}
          >
            <InputTextStyled
              style={{ marginVertical: 6 }}
              placeholder="Descripción"
              label="Descripción"
              onChangeText={(value) => setComment(value)}
            ></InputTextStyled>
            <Text style={gStyles.h3}>No necesita mantenimiento</Text>
          </ButtonConfirm>
        ) : (
          <ButtonConfirm
            icon="wrench"
            openColor={'primary'}
            openVariant={'outline'}
            handleConfirm={async () => {
              return await handleMarkAsNeedFix()
            }}
            confirmColor="error"
          >
            <Text style={gStyles.h3}>Necesita mantenimiento</Text>
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

export default ItemActions

const styles = StyleSheet.create({})
