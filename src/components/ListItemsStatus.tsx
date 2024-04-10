import { StyleSheet } from 'react-native'
import React from 'react'
import OrderType from '../types/OrderType'
import getItemsFromOrders from '../libs/getItemsFromOrders'
import ListItems from './ListItems'

const ListItemsStatus = ({ orders }: { orders: OrderType[] }) => {
  const items = getItemsFromOrders({ orders })

  return <ListItems items={items} />
}

export default ListItemsStatus

const styles = StyleSheet.create({})
