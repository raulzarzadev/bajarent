import { FlatList, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import Button from './Button'
import Chip from './Chip'
import dictionary from '../dictionary'
import asDate, { fromNow } from '../libs/utils-date'
import theme from '../theme'
import { ServiceComments } from '../firebase/ServiceComments'
import { useStore } from '../contexts/storeContext'
import OrderType from '../types/OrderType'
import { gStyles } from '../styles'
import { useNavigation } from '@react-navigation/native'

export type CommentType = OrderType['comments'][number]

const ListComments = ({
  comments,
  style,
  viewOrder,
  refetch
}: {
  comments: CommentType[]
  style?: ViewStyle
  viewOrder?: boolean
  refetch?: () => void
}) => {
  const sortByDate = (a, b) =>
    asDate(b.createdAt).getTime() - asDate(a.createdAt).getTime()
  return (
    <FlatList
      style={style}
      data={comments.sort(sortByDate)}
      renderItem={({ item }) => (
        <Comment comment={item} viewOrder={viewOrder} refetch={refetch} />
      )}
      keyExtractor={(item) => item.id}
    />
  )
}

const Comment = ({
  comment,
  viewOrder,
  refetch
}: // orderId
{
  comment: CommentType
  viewOrder: boolean
  refetch?: () => void
  // orderId: string
}) => {
  const [disabled, setDisabled] = React.useState(false)
  const { navigate } = useNavigation()
  const { staff } = useStore()

  const handleToggleSolveReport = async (commentId, solved) => {
    setDisabled(true)
    await ServiceComments.update(commentId, {
      solved: !solved
    })
      .then((res) => {
        console.log(res)
      })
      .catch((res) => console.error(res))
      .finally(() => {
        refetch?.()
        setDisabled(false)
      })
  }
  return (
    <View style={{ width: '100%', marginHorizontal: 'auto' }}>
      <View style={{ justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Text style={{ fontWeight: 'bold', marginRight: 4 }}>
            {staff?.find((s) => s?.userId === comment?.createdBy)?.name}
          </Text>
          <Text style={{ marginRight: 4 }}>{fromNow(comment.createdAt)}</Text>
          {comment?.type === 'report' && (
            <Chip
              disabled={disabled}
              title={dictionary(comment?.type)}
              color={theme.error}
              titleColor={theme.neutral}
              size="xs"
            />
          )}

          <View style={{ marginLeft: 4 }}>
            <Button
              disabled={disabled}
              icon="done"
              color={comment.solved ? 'success' : 'primary'}
              variant={comment.solved ? 'filled' : 'ghost'}
              onPress={() =>
                handleToggleSolveReport(comment.id, comment.solved)
              }
              justIcon
              size="xs"
            />
          </View>
          {viewOrder && (
            <OrderShortData
              style={{ marginLeft: 4 }}
              orderId={comment.orderId}
            />
          )}
        </View>
      </View>
      <Text
        style={[
          {
            width: '100%',
            textAlign: 'left',
            paddingVertical: 3
          },
          gStyles.helper
        ]}
      >
        {comment?.content}
      </Text>
    </View>
  )
}

const OrderShortData = ({
  orderId,
  style
}: {
  orderId: string
  style: ViewStyle
}) => {
  const { orders } = useStore()
  const order = orders.find((o) => o.id === orderId)
  const { navigate } = useNavigation()
  return (
    <Chip
      style={style}
      title={`${order?.folio}  ${order?.fullName}`}
      size="xs"
      color={theme.primary}
      onPress={() =>
        // @ts-ignore
        navigate('OrderDetails', { orderId: order.id })
      }
    ></Chip>
  )
}

export default ListComments

const styles = StyleSheet.create({})
