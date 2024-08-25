import { View } from 'react-native'
import React from 'react'
import ButtonConfirm from './ButtonConfirm'
import InputRadios from './InputRadios'
import { useStore } from '../contexts/storeContext'

const InputAssignSection = ({
  currentSection,
  disabled,
  setNewSection
}: {
  currentSection?: string | null
  disabled?: boolean
  setNewSection?: (sectionId: string | null) => Promise<void>
}) => {
  const { storeSections } = useStore()
  const [sectionId, setSectionId] = React.useState<string | null>(null)
  const assignedToSectionName = storeSections?.find(
    (s) => s.id === currentSection
  )?.name
  return (
    <View>
      <ButtonConfirm
        openDisabled={disabled}
        openLabel={assignedToSectionName || 'Asignar'}
        icon="swap"
        openVariant="outline"
        confirmLabel="Cambiar"
        handleConfirm={async () => {
          return await setNewSection(sectionId)
        }}
      >
        <InputRadios
          layout="row"
          label="Selecciona un area"
          setValue={(sectionId) => {
            setSectionId(sectionId)
          }}
          containerStyle={{ marginVertical: 6 }}
          value={sectionId}
          options={storeSections.map(({ id, name }) => {
            return {
              label: name,
              value: id
            }
          })}
        />
      </ButtonConfirm>
    </View>
  )
}

export default InputAssignSection
