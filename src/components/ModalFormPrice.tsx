import { View } from 'react-native'
import useModal from '../hooks/useModal'
import type { PriceType } from '../types/PriceType'
import Button, { type ButtonProps } from './Button'
import FormPrice from './FormPrice'
import type { IconName } from './Icon'
import StyledModal from './StyledModal'

const ModalFormPrice = ({
	handleSubmit,
	values,
	icon = 'add',
	variant = 'filled'
}: {
	icon?: IconName
	variant?: ButtonProps['variant']
	values?: Partial<PriceType>
	handleSubmit: (values: Partial<PriceType>) => Promise<any>
}) => {
	const isEdit = !!values?.id
	const modal = useModal({
		title: isEdit ? 'Editar precio' : 'Agregar precio'
	})
	return (
		<View>
			<Button variant={variant} icon={icon} justIcon onPress={modal.toggleOpen}></Button>
			<StyledModal {...modal}>
				<FormPrice
					defaultPrice={values}
					handleSubmit={price => {
						modal.toggleOpen()
						return handleSubmit(price)
					}}
				/>
			</StyledModal>
		</View>
	)
}

export default ModalFormPrice
