import { View, Text } from 'react-native'
import React, { ReactNode, useEffect } from 'react'
import List from './List'
import { ServiceComments } from '../firebase/ServiceComments'
import { useAuth } from '../contexts/authContext'
import { CommentType } from './ListComments'
import { colors } from '../theme'
import PaymentType from '../types/PaymentType'
import CurrencyAmount from './CurrencyAmount'
import { useStore } from '../contexts/storeContext'
import { isToday } from 'date-fns'
import asDate from '../libs/utils-date'

const ListMovements = () => {
  const [data, setData] = React.useState<MovementType[]>([])
  const { storeId } = useAuth()
  const { payments } = useStore()
  useEffect(() => {
    ServiceComments.getToday(storeId).then(async (comments) => {
      const todayPayments = payments.filter(({ createdAt }) => {
        return isToday(asDate(createdAt))
      })
      const movements = await formatMovements({
        comments,
        payments: todayPayments
      })
      setData(movements)
    })
  }, [])

  return (
    <List
      ComponentRow={RowMovement}
      data={data}
      filters={[{ field: 'type', label: 'Tipo' }]}
      defaultSortBy={'createdAt'}
      defaultOrder="des"
    />
  )
}

const RowMovement = ({ item }: { item: MovementType }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 4,
        backgroundColor: colors.lightGray,
        padding: 8,
        width: '100%',
        borderRadius: 4,
        justifyContent: 'space-between'
      }}
    >
      <Text>{item.type}</Text>
      <Text>{item.title}</Text>
      <View>{item?.content}</View>
    </View>
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
