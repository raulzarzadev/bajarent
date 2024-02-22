import { useState } from 'react'
import { PriceType } from '../types/PriceType'
import { ServicePrices } from '../firebase/ServicePrices'
import { useStore } from '../contexts/storeContext'

function usePrices() {
  const { updatePrices } = useStore()
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
    await ServicePrices.create(price).catch((e) => console.log(e))
    updatePrices()
  }
  const updatePrice = async (
    priceId: PriceType['id'],
    price: Partial<PriceType>
  ) => {
    await ServicePrices.update(priceId, price).catch((e) => console.log(e))
    updatePrices()
  }
  const deletePrice = async (priceId: PriceType['id']) => {
    await ServicePrices.delete(priceId).catch((e) => console.log(e))
    updatePrices()
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
