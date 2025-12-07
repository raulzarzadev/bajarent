import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useStore } from '../contexts/storeContext'
import InputSelect from './InputSelect'

const SelectStoreSection = ({
	value,
	setValue
}: {
	value: string
	setValue: (value: { type: string; section: string }) => void
}) => {
	const { sections: storeSections } = useStore()
	const options = storeSections.map(section => ({
		label: section.name,
		value: section.id
	}))
	const allOptions = [{ label: 'Todas', value: 'full' }, ...options]

	const [_value, _setValue] = useState(value)

	const handleChangeValue = (value: string) => {
		if (value === 'full') {
			_setValue(value)
			setValue({ type: 'full', section: '' })
		} else {
			_setValue(value)
			setValue({ type: 'partial', section: value })
		}
	}

	return <InputSelect value={_value} options={allOptions} onChangeValue={handleChangeValue} />
}

export default SelectStoreSection

const styles = StyleSheet.create({})
