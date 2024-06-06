import { ItemMap } from '../components/ItemsMap'
import theme, { colors } from '../theme'
import { ItemBase } from '../types/ItemType'
import OrderType, { order_status, order_type } from '../types/OrderType'

export const isCoordinates = (str: string): boolean => {
  const regex = /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/
  return regex.test(str)
}

export const getCoordinates = async (
  location = ''
): Promise<[number, number]> | null => {
  const isLocationCoordinates = isCoordinates(location)
  const isShortUrl = location.match(/^https:\/\/\S+/)
  if (isLocationCoordinates) {
    const coords = location?.split(',')
    return [parseFloat(coords[0]), parseFloat(coords[1])]
  } else if (isShortUrl) {
    console.log('is a url', { isShortUrl })
    //const coords = await getCoordinatesFromShortUrl(location)
    return null
  } else {
    return null
  }
}
export const formatItemsMaps = async (
  orders: OrderType[]
): Promise<ItemMap[]> => {
  return await Promise.all(
    orders?.map(async (item) => {
      let coords = await getCoordinates(item.location)
      return {
        itemId: item.id,
        clientName: item.fullName,
        orderFilo: item.folio,
        coords,
        label: `${item.folio}`,
        iconColor: (() => {
          if (item.isExpired) return theme.success
          if (item.status === order_status.AUTHORIZED) return theme.warning
          if (item.hasNotSolvedReports) return theme.error
          return colors.transparent
        })()
      }
    })
  )
}

export const formatOrderItemsMaps = async (
  orders: OrderType[]
): Promise<ItemMap[]> => {
  return await Promise.all(
    orders
      ?.map(async (order) => {
        let coords = await getCoordinates(order.location)

        const items = order?.items?.map((item) => ({
          itemId: item.id,
          clientName: order.fullName,
          orderFilo: order.folio,
          coords,
          label: `${order.folio}`,
          iconColor: (() => {
            if (order.isExpired) return theme.success
            if (order.status === order_status.AUTHORIZED) return theme.warning
            if (order.hasNotSolvedReports) return theme.error
            return colors.transparent
          })()
        }))
        return items?.filter(Boolean)
      })
      .filter(Boolean)
      .flat()
  ).then((res) => res?.flat()?.filter(Boolean))
}

export const createItemsFromOrders = (orders: OrderType[]): ItemBase[] => {
  return orders.map((order) => createItemsFromOrder(order)).flat()
}

export const createItemsFromOrder = (order: OrderType): ItemBase[] => {
  const isRented =
    order.status === order_status.DELIVERED && order.type === order_type.RENT
  return order.items.map((item) => ({
    number: '',
    id: item.id || '',
    serial: item.serial || '',
    brand: item.brand || '',
    currentLocation: order.location || '',
    currentOrderId: order.id || '',
    status: isRented ? 'rented' : 'stock',
    category: item.categoryName || '',
    assignedSection: order.assignToSection || ''
  }))
}
