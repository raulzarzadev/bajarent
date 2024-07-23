import React, { useEffect } from 'react'
import { LoadingList } from './List'
import { ServiceComments } from '../firebase/ServiceComments'
import { useAuth } from '../contexts/authContext'
import { CommentType } from './ListComments'
import { useStore } from '../contexts/storeContext'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'
import formatComments from '../libs/formatComments'
import { comment_types, FormattedComment } from '../types/CommentType'
import { useOrdersCtx } from '../contexts/ordersContext'
import { View } from 'react-native'
import HeaderDate from './HeaderDate'
import { CommentRow } from './RowComment'
import { ServiceItemHistory } from '../firebase/ServiceItemHistory'
import dictionary from '../dictionary'

const ListMovements = () => {
  const [data, setData] = React.useState<FormattedComment[]>([])
  const { storeId } = useAuth()
  const { payments, staff, items } = useStore()

  const { orders } = useOrdersCtx()

  const [date, setDate] = React.useState(new Date())
  const handleChangeDate = (newDate: Date) => {
    setDate(newDate)
  }
  const [itemsMovements, setItemsMovements] = React.useState([])

  useEffect(() => {
    //* get items movements

    ServiceItemHistory.getItemsMovements({
      storeId,
      date: asDate(date),
      items: items.map(({ id }) => id)
    }).then((res) => {
      const asMovement: Partial<CommentType>[] = res.map((movement) => {
        const itemDetails = items.find(({ id }) => id === movement.itemId)
        return {
          type: comment_types['item-movement'],
          title: 'hola',
          createdAt: movement.createdAt,
          user: movement.createdBy,
          createdBy: movement.createdBy,
          storeId,
          orderId: movement.orderId,
          content: ` ${
            itemDetails?.number
              ? `Artículo no. ${itemDetails?.number}  ${dictionary(
                  movement.type
                )}`
              : `${dictionary(movement.type)}`
          }`,
          id: movement?.id || '',
          itemId: itemDetails?.id || ''
        }
      })
      setItemsMovements(asMovement)
    })
  }, [])

  useEffect(() => {
    ServiceComments.getByDate(storeId, date).then(async (comments) => {
      const todayPayments = payments.filter(({ createdAt }) => {
        return isToday(asDate(createdAt))
      })
      const movements = await formatComments({
        comments,
        orders,
        staff,
        payments: todayPayments
      })
      setData([...movements])
    })
  }, [orders, date])

  return (
    <View>
      <HeaderDate
        label="Movimientos"
        onChangeDate={handleChangeDate}
        debounce={700}
      />
      <LoadingList
        ComponentRow={({ item }) => <CommentRow comment={item} />}
        data={[...data, ...itemsMovements]}
        filters={[
          { field: 'type', label: 'Tipo' },
          {
            field: 'orderType',
            label: 'Tipo de orden'
          },
          {
            field: 'createdByName',
            label: 'Usuario'
          }
        ]}
        defaultSortBy={'createdAt'}
        defaultOrder="des"
      />
    </View>
  )
}

// export type MovementType = {
//   type: string
//   title: string
//   createdAt: string
//   user: string
//   content: ReactNode
//   id: string
//   itemId?: string
// }
// const formatMovements = ({
//   comments,
//   payments
// }: {
//   comments: CommentType[]
//   payments: PaymentType[]
// }): MovementType[] => {
//   let res = []
//   payments.forEach((payment) => {
//     res.push({
//       type: 'Pago',
//       createdAt: payment.createdAt,
//       user: payment.createdBy,
//       content: <CurrencyAmount amount={payment.amount} />,
//       id: payment.id
//     })
//   })
//   comments.forEach((comment) => {
//     res.push({
//       type: comment.type === 'comment' ? 'Comentario' : 'Reporte',
//       createdAt: comment.createdAt,
//       user: comment.createdBy,
//       title: comment.content,
//       id: comment.id
//     })
//   })
//   return res
// }

export default ListMovements
