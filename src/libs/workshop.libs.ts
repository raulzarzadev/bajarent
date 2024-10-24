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
    (item) =>
      item.needFix &&
      (item.workshopStatus === 'pending' || item.status === 'pickedUp')
  )

  const inProgress = items.filter((item) => item.workshopStatus === 'started')
  const finished = items.filter(
    (item) => !item.needFix && item.workshopStatus === 'finished'
  )
  const shouldPickup = items.filter((item) => item.workshopStatus === 'pending')
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
  return items?.map((item) => {
    const workshopStatus =
      //@ts-ignore
      ['inProgress', 'pending'].includes(item?.workshopStatus)
        ? 'pickedUp'
        : item?.workshopStatus

    return {
      ...item,
      id: item?.id,
      categoryName:
        categories.find((cat) => cat.id === item?.category)?.name || '',
      assignedSectionName:
        sections.find((sec) => sec.id === item?.assignedSection)?.name || '',
      needFix: !!item?.needFix,
      isRented: !!(item?.status === 'rented'),
      isPickedUp: !!(item?.status === 'pickedUp'),
      checkedInInventory: isToday(asDate(item?.lastInventoryAt)),
      workshopFlow: item?.workshopFlow,
      workshopStatus: workshopStatus || 'pickedUp'
    }
  })
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
      if (order.folio === 103) {
        console.log({ order })
      }
      const workshopStatus =
        //@ts-ignore
        order.workshopStatus === 'inProgress'
          ? 'pickedUp'
          : order.workshopStatus

      const needFix =
        order.status === order_status.REPAIRING ||
        order.status === order_status.AUTHORIZED ||
        order.status === order_status.PICKED_UP
      const item = order.item
      const failDescription = item?.failDescription || order?.repairInfo || ''
      const formattedItem = {
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
        workshopStatus: workshopStatus || 'pending',
        workshopFlow: order?.workshopFlow || {},
        failDescription,
        repairDetails: {
          failDescription,
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
        orderId: order?.id,
        scheduledAt: asDate(order?.scheduledAt)
      }

      return formattedItem
    }
  )
  return items
}
