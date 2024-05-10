import { isAfter, isBefore } from 'date-fns'
import OrderType from '../../../types/OrderType'
import { CommentType } from '../../../types/CommentType'
import { orderExpireAt } from '../../../libs/orders'

export const handleSetStatuses = ({
  order,
  reports = []
}: {
  order: Partial<OrderType>
  reports?: Partial<CommentType>[]
}): {
  order: Partial<OrderType>
  statuses: {
    isReported: boolean
    isExpired: boolean
    isDelivered?: boolean
    isAuthorized?: boolean
  }
} => {
  const expireAt = order.expireAt || orderExpireAt({ order })
  const isReported =
    !!reports?.find((report) => report.type === 'report' && !report.solved) ||
    !!order?.isReported
  const isDelivered = order?.status === 'DELIVERED'
  const isAuthorized = order?.status === 'AUTHORIZED'
  order = {
    ...order,
    expireAt,
    isReported
  }
  return {
    order,
    statuses: {
      isReported,
      isExpired: !!expireAt && isAfter(new Date(), expireAt),
      isDelivered,
      isAuthorized
    }
  }
}
