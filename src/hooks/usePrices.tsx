import { useState } from 'react'
import { PriceType } from '../types/PriceType'
import { ServicePrices } from '../firebase/ServicePrices'

function usePrices() {
  const [storePrices, setStorePrices] = useState<PriceType[]>([])
  const [categoryPrices, setCategoryPrices] = useState<PriceType[]>([])

  const fetchCategoryPrices = async (categoryId: string) => {
    const prices = await ServicePrices.getByCategory(categoryId)

    setCategoryPrices(prices)
  }

  const fetchStorePrices = async (storeId: string) => {
    const prices = await ServicePrices.getByStore(storeId)
    setStorePrices(prices)
  }
  const createPrice = async (
    price: Partial<PriceType>,
    storeId: string,
    categoryId: string
  ) => {
    price.storeId = storeId
    price.categoryId = categoryId
    return await ServicePrices.create(price).catch((e) => console.log(e))
  }
  const updatePrice = async (
    priceId: PriceType['id'],
    price: Partial<PriceType>
  ) => {
    return await ServicePrices.update(priceId, price).catch((e) =>
      console.log(e)
    )
  }
  const deletePrice = async (priceId: PriceType['id']) => {
    return await ServicePrices.delete(priceId).catch((e) => console.log(e))
  }

  return {
    fetchCategoryPrices,
    fetchStorePrices,
    storePrices,
    categoryPrices,
    createPrice,
    updatePrice,
    deletePrice
  }
}
export default usePrices
