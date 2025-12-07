import { Text, View, ViewStyle } from 'react-native'
import React from 'react'
import Button from './Button'
import theme from '../theme'
import OrderType from '../types/OrderType'
import { gSpace, gStyles } from '../styles'
import List from './List'
import { FormattedComment } from '../types/CommentType'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import Icon from './Icon'
import { CommentRow } from './RowComment'

export type CommentType = OrderType['comments'][number]

const ListComments = ({
	comments,
	style,
	viewOrder,
	refetch
}: {
	comments: FormattedComment[]
	style?: ViewStyle
	viewOrder?: boolean
	refetch?: (props?: { id?: string; count?: number }) => void
}) => {
	const modal = useModal()
	return (
		<View style={[{ width: '100%' }, style]}>
			<StyledModal {...modal}>
				<Text style={{ textAlign: 'center' }}>Descarga más comentarios</Text>
				<Text style={gStyles.helper}>Se descargan en orden, comenzando por los ultimos.</Text>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-around',
						width: '100%',
						margin: 'auto',
						marginVertical: gSpace(2)
					}}
				>
					<Button label="10" onPress={() => refetch({ count: 10 })} size="small" />
					<Button label="20" onPress={() => refetch({ count: 20 })} size="small" />
					<Button label="40" onPress={() => refetch({ count: 40 })} size="small" />
					<Button label="80" onPress={() => refetch({ count: 80 })} size="small" />
				</View>
				<Text style={gStyles.helper}>
					<Icon icon="info" color={theme.info} size={22} />
					Esto ahorra datos y tiempos de carga. Estamos buscando alternativas para omitir esto en el
					futuro.{' '}
				</Text>
			</StyledModal>
			<View
				style={{
					marginVertical: gSpace(1),
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text
					style={[
						gStyles.helper,
						{
							textAlign: 'center'
						}
					]}
				>
					Solo se descargan los ultimos 10 commentarios. Para descargar más pulsa{' '}
					<Icon icon="download" size={15} />
				</Text>
			</View>
			<List
				id="list-comments"
				sideButtons={[
					{
						icon: 'download',
						label: '',
						onPress: modal.toggleOpen,
						visible: true
					}
				]}
				defaultOrder="des"
				defaultSortBy="createdAt"
				ComponentRow={props => (
					<CommentRow comment={props.item} key={props.item.id} refetch={refetch} />
				)}
				data={comments}
				filters={[
					{ field: 'type', label: 'Tipo' },
					{ field: 'solved', label: 'Resuelto', boolean: true },
					{ field: 'createdByName', label: 'Creado por' }
				]}
				sortFields={[
					{ label: 'Fecha', key: 'createdAt' },
					{ label: 'Creado por', key: 'createdBy' },
					{ label: 'Tipo', key: 'type' }
				]}
			/>
		</View>
	)
}

export default ListComments
