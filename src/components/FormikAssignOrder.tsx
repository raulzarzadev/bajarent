import { useStore } from '../contexts/storeContext'
import FormikInputSelect from './FormikInputSelect'

const FormikAssignOrder = () => {
	const { sections: storeSections } = useStore()
	const options = storeSections.map(section => ({
		label: section.name,
		value: section.id
	}))

	return (
		<FormikInputSelect
			name={'assignToSection'}
			options={options}
			placeholder={'Asignar area'}
			helperText="Asigna esta orden a un area"
		/>
	)
}

export default FormikAssignOrder
