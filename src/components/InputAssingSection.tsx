import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import ButtonConfirm from './ButtonConfirm'
import InputCheckboxes from './Inputs/InputCheckboxses'
import InputRadios from './Inputs/InputRadios'

const InputAssignSection = ({
	modalTitle = 'Asignar area',
	currentSection,
	disabled,
	setNewSection,
	justIcon
}: {
	justIcon?: boolean
	modalTitle?: string
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
	const { sections: storeSections = [] } = useStore()
	const [sectionId, setSectionId] = useState<string | null>(null)

	const assignedToSectionName = storeSections?.find(s => s.id === currentSection)?.name || null

	const newSectionName = storeSections?.find(s => s.id === sectionId)?.name || null

	useEffect(() => {
		setSectionId(currentSection)
	}, [currentSection])

	const storeSectionOptions = storeSections?.map(({ id, name }) => {
		return {
			label: name,
			value: id
		}
	})

	return (
		<ButtonConfirm
			justIcon={justIcon}
			openSize="small"
			openFullWidth
			modalTitle={modalTitle}
			openDisabled={disabled}
			openLabel={assignedToSectionName || 'Asignar'}
			icon="swap"
			openColor="success"
			openVariant={sectionId ? 'filled' : 'ghost'}
			confirmLabel="Cambiar"
			handleConfirm={async () => {
				if (!setNewSection) return console.error('this function is not implemented')
				return await setNewSection?.({
					sectionId,
					sectionName: newSectionName
				})
			}}
		>
			<InputRadios
				layout="row"
				label="Selecciona un area"
				onChange={sectionId => {
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

export const InputAssignSections = ({
	currentSections,
	disabled,
	setNewSections,
	justIcon
}: {
	justIcon?: boolean
	currentSections?: string[] | null
	disabled?: boolean
	setNewSections?: ({
		sectionIds,
		sectionNames
	}: {
		sectionIds: string[]
		sectionNames: string[]
	}) => Promise<void>
}) => {
	const { sections: storeSections = [] } = useStore()
	const [sectionIds, setSectionIds] = useState<string[]>([])

	// const assignedToSectionNames =
	//   currentSections?.map(
	//     (id) => storeSections.find((s) => s.id === id)?.name
	//   ) || []

	const newSectionNames = sectionIds?.map(id => storeSections.find(s => s.id === id)?.name) || []

	useEffect(() => {
		setSectionIds(currentSections || [])
	}, [currentSections])

	const storeSectionOptions = storeSections?.map(({ id, name }) => {
		return {
			label: name,
			value: id
		}
	})

	return (
		<ButtonConfirm
			justIcon={justIcon}
			openSize="small"
			openFullWidth
			modalTitle="Asignar areas"
			openDisabled={disabled}
			openLabel={'Asignar areas'}
			icon="swap"
			openColor="success"
			openVariant={sectionIds.length ? 'filled' : 'ghost'}
			confirmLabel="Asignar"
			handleConfirm={async () => {
				if (!setNewSections) return console.error('this function is not implemented')
				setSectionIds(sectionIds)
				return await setNewSections?.({
					sectionIds,
					sectionNames: newSectionNames
				})
			}}
		>
			<InputCheckboxes
				layout="row"
				label="Selecciona un area"
				onChange={sectionsIds => {
					setSectionIds(sectionsIds)
				}}
				stylesOption={{ marginVertical: 8, marginRight: 8 }}
				value={currentSections}
				options={storeSectionOptions.sort((a, b) => a.label.localeCompare(b.label))}
			/>
		</ButtonConfirm>
	)
}
