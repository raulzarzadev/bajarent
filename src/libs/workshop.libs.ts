import { isToday } from 'date-fns'
import ItemType, { ItemExternalRepairProps } from '../types/ItemType'
import asDate from './utils-date'
import { SectionType } from '../types/SectionType'
import { CategoryType } from '../types/RentItem'
import OrderType, {
  ContactType,
  order_status,
  OrderQuoteType
} from '../types/OrderType'

export const splitItems = ({
  items = []
}: {
  items: Partial<ItemExternalRepairProps>[]
}) => {
  if (!items.length)
    return {
      needFix: [],
      inProgress: [],
      finished: [],
      shouldPickup: []
    }
  const needFix = items.filter(
    (item) => item?.needFix && ['pending'].includes(item?.workshopStatus)
  )
  const inProgress = items.filter(
    (item) => item.workshopStatus === 'inProgress'
  )
  const finished = items.filter(
    (item) => !item.needFix || item.workshopStatus === 'finished'
  )
  const shouldPickup = items.filter(
    (item) => item.workshopStatus === 'shouldPickup'
  )
  return {
    needFix,
    inProgress,
    finished,
    shouldPickup
  }
}

export const formatItems = (
  items: Partial<ItemType>[],
  categories: Partial<CategoryType>[],
  sections: SectionType[]
) => {
  return items?.map((item) => ({
    ...item,
    id: item?.id,
    categoryName:
      categories.find((cat) => cat.id === item?.category)?.name || '',
    assignedSectionName:
      sections.find((sec) => sec.id === item?.assignedSection)?.name || '',
    needFix: !!item?.needFix,
    isRented: !!(item?.status === 'rented'),
    isPickedUp: !!(item?.status === 'pickedUp'),
    checkedInInventory: isToday(asDate(item?.lastInventoryAt))
  }))
}

export const formatItemsFromRepair = ({
  repairOrders,
  categories,
  storeSections
}: {
  repairOrders: Partial<OrderType>[]
  categories: Partial<CategoryType>[]
  storeSections: SectionType[]
}): Partial<ItemType>[] => {
  const items: Partial<ItemExternalRepairProps>[] = repairOrders.map(
    (order) => {
      const needFix =
        order.status === order_status.REPAIRING ||
        order.status === order_status.AUTHORIZED

      const workshopStatus = (() => {
        const workshopStatuses = {
          //  [order_status.REPAIRING]: 'inProgress',
          [order_status.AUTHORIZED]: 'shouldPickup',
          [order_status.REPAIRING]: 'pending',
          [order_status.REPAIRED]: 'finished'
        }

        if (
          order.status === order_status.REPAIRING &&
          order.workshopStatus === 'inProgress'
        )
          return 'inProgress'

        if (order.status === order_status.AUTHORIZED) return 'shouldPickup'
        if (order.status === order_status.REPAIRING) return 'pending'
        if (order.status === order_status.REPAIRED) return 'finished'
        return workshopStatuses[order.status]
      })()

      const item = order.item
      return {
        id: order?.id,
        categoryName:
          categories.find((cat) => cat.id === item?.categoryId)?.name || '',
        assignedSectionName:
          storeSections.find((sec) => sec.id === order.assignToSection)?.name ||
          '',
        needFix,
        number: String(order.folio) || '',
        brand: item?.brand || '',
        serial: item?.serial || '',
        workshopStatus,
        repairDetails: {
          failDescription: item?.failDescription || order?.description || '',
          quotes: (order?.quotes as OrderQuoteType[]) || [],
          clientName: order?.fullName || '',
          contacts: [
            { name: '', phone: order.phone, isOriginal: true },
            ...((order?.contacts as ContactType[]) || [])
          ],
          address:
            `${order?.neighborhood || ''} ${order?.address || ''} ${
              order?.references || ''
            }` || '',
          location: order?.coords
            ? `https://maps.google.com/?${order?.coords}`
            : order?.location || ''
        },
        isExternalRepair: true,
        orderId: order?.id
      }
    }
  )
  return items
}
