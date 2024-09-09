import React, { useEffect } from 'react'
import { LoadingList } from './List'
//import { ServiceComments } from '../firebase/ServiceComments'
import { useAuth } from '../contexts/authContext'
import { useStore } from '../contexts/storeContext'
import { FormattedComment } from '../types/CommentType'
//import { useOrdersCtx } from '../contexts/ordersContext'
import { View } from 'react-native'
import HeaderDate from './HeaderDate'
import { CommentRow } from './RowComment'
import Loading from './Loading'
import theme from '../theme'

const ListMovements = () => {
  const [data, setData] = React.useState<Partial<FormattedComment[]>>([])
  //const { storeId } = useAuth()
  //const { payments, staff } = useStore()
  const [loading, setLoading] = React.useState(false)
  // const {
  //   consolidatedOrders: { orders }
  // } = useOrdersCtx()

  const [date, setDate] = React.useState(new Date())
  const handleChangeDate = async (newDate: Date) => {
    try {
      setLoading(true)
      setDate(newDate)
      // const res = await ServiceComments.getByDate(storeId, new Date(newDate))
      setLoading(false)
      setData([])
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    handleChangeDate(date)
  }, [])

  //console.log({ data })

  return (
    <View>
      <HeaderDate
        label="Movimientos"
        onChangeDate={handleChangeDate}
        debounce={700}
      />
      {loading && <Loading />}
      <LoadingList
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
