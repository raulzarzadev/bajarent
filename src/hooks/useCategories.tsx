import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import { ServiceCategories } from '../firebase/ServiceCategories'
import { CategoryType } from '../types/RentItem'

function useCategories() {
  const { storeId } = useStore()
  const [categories, setCategories] = useState<CategoryType[]>([])

  useEffect(() => {
    if (storeId) {
      fetchCategories()
    }
  }, [storeId])

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)
  }

  const fetchCategories = async () => {
    const categories = await ServiceCategories.getByStore(storeId).catch((e) =>
      console.log(e)
    )
    console.log('update cat')
    setCategories(categories || [])
  }
  const createCategory = async (values: CategoryType) => {
    values.storeId = storeId
    await ServiceCategories.create(values).catch((e) => console.log(e))
    fetchCategories()
  }
  const updateCategory = async (categoryId: string, values: CategoryType) => {
    await ServiceCategories.update(categoryId, values).catch((e) =>
      console.log(e)
    )
    fetchCategories()
  }
  const deleteCategory = async (categoryId: string) => {
    await ServiceCategories.delete(categoryId).catch((e) => console.log(e))
    fetchCategories()
  }

  return {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    getCategory
  }
}

export default useCategories
