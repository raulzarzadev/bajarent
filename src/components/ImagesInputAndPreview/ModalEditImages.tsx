import useModal from '../../hooks/useModal'
import { ImageDescriptionType } from '../../state/features/costumers/customerType'
import Button from '../Button'
import { FormikImageDescription } from '../OrderImagesUpdate'
import StyledModal from '../StyledModal'

export const ModalEditImages = ({
	handleUpdate
}: {
	handleUpdate?: (values: ImageDescriptionType) => Promise<void> | void
}) => {
	const modal = useModal({ title: 'Agregar imagen' })

	return (
		<>
			<Button icon="add" onPress={modal.toggleOpen} variant="ghost" size="small" justIcon />
			<StyledModal {...modal}>
				<FormikImageDescription
					handleSubmit={async values => {
						await handleUpdate?.(values)

						modal.toggleOpen()
						return
					}}
				/>
			</StyledModal>
		</>
	)
}
