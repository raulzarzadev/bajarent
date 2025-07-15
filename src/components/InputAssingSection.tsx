import { View } from 'react-native'
import React, { useEffect } from 'react'
import ButtonConfirm from './ButtonConfirm'
import { useStore } from '../contexts/storeContext'
import InputRadios from './Inputs/InputRadios'

const InputAssignSection = ({
  currentSection,
  disabled,
  setNewSection
}: {
  currentSection?: string | null
  disabled?: boolean
  setNewSection?: ({
    sectionId,
    sectionName
  }: {
    sectionId: string | null
    sectionName: string
  }) => Promise<void>
}) => {
  const { sections: storeSections } = useStore()
  const [sectionId, setSectionId] = React.useState<string | null>(null)

  const assignedToSectionName =
    storeSections?.find((s) => s.id === currentSection)?.name || null

  const newSectionName =
    storeSections?.find((s) => s.id === sectionId)?.name || null

  useEffect(() => {
    setSectionId(currentSection)
  }, [currentSection])

  const storeSectionOptions = storeSections.map(({ id, name }) => {
    return {
      label: name,
      value: id
    }
  })
  return (
    <ButtonConfirm
      openSize="small"
      openFullWidth
      modalTitle="Asignar artículo"
      openDisabled={disabled}
      openLabel={assignedToSectionName || 'Asignar'}
      icon="swap"
      openColor="success"
      openVariant="filled"
      confirmLabel="Cambiar"
      handleConfirm={async () => {
        return await setNewSection({
          sectionId,
          sectionName: newSectionName
        })
      }}
    >
      <InputRadios
        layout="row"
        label="Selecciona un area"
        onChange={(sectionId) => {
          setSectionId(sectionId)
        }}
        stylesOption={{ marginVertical: 8, marginRight: 8 }}
        value={sectionId}
        options={[
          { label: 'Sin', value: null },
          ...storeSectionOptions.sort((a, b) => a.label.localeCompare(b.label))
        ]}
      />
    </ButtonConfirm>
  )
}

export default InputAssignSection
