import { useStore } from '../contexts/storeContext'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { CategoryType } from '../types/RentItem'
import usePrices from './usePrices'

function useCategories() {
  const { storeId } = useStore()
  const { createPrice, updatePrice, deletePrice } = usePrices()
  const createCategory = async (values: Partial<CategoryType>) => {
    values.storeId = storeId
    await ServiceCategories.create(values)
      .then((r) => {
        console.log({ r })
      })
      .catch((e) => {
        console.log({ e })
      })
  }
  const updateCategory = async (
    categoryId: string,
    values: Partial<CategoryType>
  ) => {
    await ServiceCategories.update(categoryId, values)
      .then((r) => {
        console.log({ r })
      })
      .catch((e) => {
        console.log({ e })
      })
  }
  const deleteCategory = async (categoryId: string) => {
    await ServiceCategories.delete(categoryId)
      .then((r) => {
        console.log({ r })
      })
      .catch((e) => {
        console.log({ e })
      })
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    createPrice,
    updatePrice,
    deletePrice
  }
}

export default useCategories
