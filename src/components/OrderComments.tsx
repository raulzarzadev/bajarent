import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import dictionary from '../dictionary'
import theme from '../theme'
import P from './P'

const OrderComments = ({ order }: { order: OrderType }) => {
  return (
    <View>
      <P bold>Comentarioss</P>
      <View style={{ padding: theme.padding.sm }}>
        {order?.comments?.map((comment, i) => (
          <OrderComment key={i} comment={comment} />
        ))}
      </View>
    </View>
  )
}

const OrderComment = ({
  comment
}: {
  comment: OrderType['comments'][number]
}) => {
  return (
    <View>
      <P>{dictionary(comment?.type)}</P>
      <P>{comment?.content}</P>
    </View>
  )
}
export default OrderComments

const styles = StyleSheet.create({})
