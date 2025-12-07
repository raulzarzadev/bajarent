import React, { useMemo } from 'react'
import { useField } from 'formik'
import InputImagePicker from './InputImagePicker'

const FormikInputImage = ({
	name,
	label,
	onUploading
}: {
	name: string
	label?: string
	onUploading?: (progress: number) => void
}) => {
	const [field, meta, helpers] = useField(name)
	const value = useMemo(() => field.value, [field.value])

	return (
		<InputImagePicker
			name={name}
			label={label}
			value={value}
			setValue={helpers.setValue}
			onUploading={(progress: number) => {
				onUploading?.(progress)
				// Notify the parent form that something is being uploaded
				// You can use a callback function or any other mechanism to communicate with the parent form
			}}
		/>
	)
}

export default FormikInputImage
