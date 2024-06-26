import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from './Button'
import { useStore } from '../contexts/storeContext'
import ButtonConfirm from './ButtonConfirm'
import InputRadios from './InputRadios'
import { onChangeItemSection } from '../firebase/actions/item-actions'
import { useNavigation } from '@react-navigation/native'

const ItemActions = ({
  itemId,
  itemSection
}: {
  itemId: string
  itemSection: string
}) => {
  const { storeSections, storeId } = useStore()
  const [sectionId, setSectionId] = React.useState<string | null>(
    itemSection || null
  )
  const currentSection = storeSections.find(({ id }) => id === itemSection).name
  const handleChangeItemSection = async () => {
    return await onChangeItemSection({
      storeId,
      itemId,
      sectionId
    })
  }
  const { navigate } = useNavigation()
  return (
    <View>
      <Button
        label="Rentar"
        onPress={() => {
          console.log('redirigir a nueva orden que incluya este item')
        }}
      />
      <ButtonConfirm
        openLabel={currentSection || 'Asignar'}
        icon="swap"
        openVariant="outline"
        confirmLabel="Cambiar"
        handleConfirm={async () => {
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
      <Button label="Detalles" onPress={() => {}} />
    </View>
  )
}

export default ItemActions

const styles = StyleSheet.create({})
