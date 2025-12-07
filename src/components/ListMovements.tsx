import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { ServiceComments } from '../firebase/ServiceComments'
import theme from '../theme'
import type { FormattedComment } from '../types/CommentType'
import HeaderDate from './HeaderDate'
import { ListE } from './List'
import Loading from './Loading'
import { CommentRow } from './RowComment'

const ListMovements = () => {
	const [data, setData] = useState<Partial<FormattedComment[]>>([])
	const { storeId } = useAuth()
	const { staff } = useStore()
	const [loading, setLoading] = useState(false)
	const [date, setDate] = useState(new Date())
	const handleChangeDate = async (newDate: Date) => {
		try {
			setLoading(true)
			setDate(newDate)
			const res = await ServiceComments.getByDate(storeId, new Date(newDate), {})
			setLoading(false)
			setData(
				res.map(item => ({
					...item,
					createdByName: staff?.find(({ userId }) => userId === item?.createdBy)?.name
				}))
			)
		} catch (error) {
			console.error(error)
		}
	}
	useEffect(() => {
		handleChangeDate(date)
	}, [])

	return (
		<View>
			<HeaderDate label="Movimientos" onChangeDate={handleChangeDate} debounce={700} />
			{loading && <Loading />}
			<ListE
				id="list-movements"
				ComponentRow={({ item }) => <CommentRow comment={item} showOrder />}
				data={data}
				filters={[
					{ field: 'type', label: 'Tipo' },
					{
						field: 'orderType',
						label: 'Tipo de orden'
					},
					{
						field: 'createdByName',
						label: 'Usuario'
					},
					{
						field: 'isReport',
						boolean: true,
						label: 'Reporte',
						icon: 'report',
						color: theme.error,
						titleColor: theme.white
					},
					{
						field: 'isImportant',
						boolean: true,
						label: 'Importante',
						icon: 'warning',
						color: theme.warning,
						titleColor: theme.accent
					},
					{
						field: 'isOrderMovement',
						boolean: true,
						label: 'Entregada',
						icon: 'orders',
						color: theme.primary,
						titleColor: theme.white
					},
					// {
					//   field: 'isPayment',
					//   boolean: true,
					//   label: 'Pago',
					//   icon: 'payment',
					//   color: theme.success
					// },
					{
						field: 'isItemMovement',
						boolean: true,
						label: 'Movimiento',
						icon: 'swap',
						color: theme.secondary,
						titleColor: theme.white
					}
				]}
				defaultSortBy={'createdAt'}
				defaultOrder="des"
			/>
		</View>
	)
}

export default ListMovements
