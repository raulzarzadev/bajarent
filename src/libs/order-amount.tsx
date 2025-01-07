import OrderType, { order_type, SaleOrderItem } from '../types/OrderType'

export const orderAmount = (order: Partial<OrderType>) => {
  if (order.type === order_type.SALE) {
    return (
      order?.items?.reduce(
        (acc, item: SaleOrderItem) =>
          acc + parseInt(`${item.price}`) * parseInt(`${item.quantity}`),
        0
      ) || 0
    )
  }
}
