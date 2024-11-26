import { ServiceStoreItems } from '../../../firebase/ServiceStoreItems'

const checkIfAllItemsExists = async ({ order }) => {
  const promises =
    order?.items?.map((item) => {
      return ServiceStoreItems.get({
        itemId: item.id,
        storeId: order.storeId
      })
    }) || []
  const res = await Promise.all(promises)
  return res.every((r) => r)
}
export default checkIfAllItemsExists
