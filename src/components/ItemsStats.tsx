import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import getItemsFromOrders, { ItemList } from '../libs/getItemsFromOrders'
import OrderType, {
  order_status,
  order_type,
  orders_should_expire
} from '../types/OrderType'
import { gStyles } from '../styles'
import theme from '../theme'
import StyledModal from './StyledModal'
import ListItems from './ListItems'
import useModal from '../hooks/useModal'

const ItemsStats = ({ orders }: { orders: OrderType[] }) => {
  const items = getItemsFromOrders({ orders })
  //* ITEMS ACTIVE
  //* An item active is an item that has been
  //* delivered
  //* and is not yet picked up
  //* is already delivered
  const itemsActive = items?.filter(
    (i) =>
      orders_should_expire.includes(i.orderType) &&
      (i.orderStatus === order_status.DELIVERED ||
        !(i.orderStatus === order_status.PICKUP))
  )

  //* ITEMS FINISHED
  //* An item finished is an item that has been
  //* pickup
  const itemsFinished = items?.filter(
    (i) =>
      orders_should_expire.includes(i.orderType) &&
      i.orderStatus === order_status.PICKUP
  )

  //* ITEMS DELIVERED
  //* An item delivered is an item that has been
  //* delivered
  //*
  const itemsDelivered = items?.filter(
    (i) => orders_should_expire.includes(i.orderType) && !!i.deliveredAt
  )

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: 'auto'
      }}
    >
      {/* Items actives */}
      <Square
        title="Activos"
        subtitle={`${itemsActive.length} `}
        items={itemsActive}
      />
      {/* Items finished */}
      <Square
        title="Finalizados"
        subtitle={`${itemsFinished.length} `}
        items={itemsFinished}
      />
      {/* Items delivered */}
      <Square
        title="Entregados"
        subtitle={`${itemsDelivered.length} `}
        items={itemsDelivered}
      />
    </View>
  )
}

const Square = ({
  title,
  subtitle,
  items
}: {
  title: string
  subtitle: string
  items: ItemList[]
}) => {
  const modal = useModal({ title })
  return (
    <View>
      <Pressable
        onPress={modal.toggleOpen}
        style={{
          backgroundColor: theme.info,
          borderRadius: 8,
          width: 140,
          height: 80,
          alignContent: 'space-around',
          justifyContent: 'center',
          margin: 8
        }}
      >
        <Text style={gStyles.h3}>{title}</Text>
        <Text style={[{ textAlign: 'center' }]}>{subtitle}</Text>
      </Pressable>
      <StyledModal {...modal}>
        <ListItems items={items} />
      </StyledModal>
    </View>
  )
}

export default ItemsStats

const styles = StyleSheet.create({})
