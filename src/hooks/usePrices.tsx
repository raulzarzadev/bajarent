import { PriceType } from '../types/PriceType'
import { ServicePrices } from '../firebase/ServicePrices'

function usePrices() {
  //const { fetchPrices } = useStore()
  const fetchPrices = () => {
    console.log('fetchPrices')
  }
  const createPrice = async (
    price: Partial<PriceType>,
    storeId: string,
    categoryId: string
  ) => {
    price.storeId = storeId
    price.categoryId = categoryId
    await ServicePrices.create(price)
      .then((r) => {
        console.log({ r })
        // updateCategories()
      })
      .catch((e) => console.error({ e }))
    fetchPrices()
  }
  const updatePrice = async (
    priceId: PriceType['id'],
    price: Partial<PriceType>
  ) => {
    await ServicePrices.update(priceId, price)
      .then((r) => {
        console.log({ r })
        //updateCategories()
      })
      .catch((e) => console.error({ e }))
    fetchPrices()
  }
  const deletePrice = async (priceId: PriceType['id']) => {
    await ServicePrices.delete(priceId)
      .then((r) => {
        console.log({ r })
        // updateCategories()
      })
      .catch((e) => console.error({ e }))
    fetchPrices()
  }

  return {
    createPrice,
    updatePrice,
    deletePrice
  }
}
export default usePrices
