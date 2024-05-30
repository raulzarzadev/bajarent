import { View, Text } from 'react-native'
import React, { ReactNode, useEffect } from 'react'
import List from './List'
import { ServiceComments } from '../firebase/ServiceComments'
import { useAuth } from '../contexts/authContext'
import { CommentRow, CommentType } from './ListComments'
import { colors } from '../theme'
import PaymentType from '../types/PaymentType'
import CurrencyAmount from './CurrencyAmount'
import { useStore } from '../contexts/storeContext'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'
import formatComments from '../libs/formatComments'
import { FormattedComment } from '../types/CommentType'
import { useOrdersCtx } from '../contexts/ordersContext'

const ListMovements = () => {
  const [data, setData] = React.useState<FormattedComment[]>([])
  const { storeId } = useAuth()
  const { payments, staff } = useStore()
  const { orders } = useOrdersCtx()
  useEffect(() => {
    ServiceComments.getToday(storeId).then(async (comments) => {
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
  }, [orders])

  return (
    <List
      ComponentRow={({ item }) => <CommentRow comment={item} viewOrder />}
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
        }
      ]}
      defaultSortBy={'createdAt'}
      defaultOrder="des"
    />
  )
}

export type MovementType = {
  type: string
  title: string
  createdAt: string
  user: string
  content: ReactNode
  id: string
}
const formatMovements = ({
  comments,
  payments
}: {
  comments: CommentType[]
  payments: PaymentType[]
}): MovementType[] => {
  let res = []
  payments.forEach((payment) => {
    res.push({
      type: 'Pago',
      createdAt: payment.createdAt,
      user: payment.createdBy,
      content: <CurrencyAmount amount={payment.amount} />,
      id: payment.id
    })
  })
  comments.forEach((comment) => {
    res.push({
      type: comment.type === 'comment' ? 'Comentario' : 'Reporte',
      createdAt: comment.createdAt,
      user: comment.createdBy,
      title: comment.content,
      id: comment.id
    })
  })
  return res
}

export default ListMovements
