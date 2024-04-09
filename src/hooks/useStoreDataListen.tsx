import { useEffect, useState } from 'react'
import StoreType from '../types/StoreType'
import OrderType from '../types/OrderType'
import { CommentType, FormattedComment } from '../types/CommentType'
import StaffType from '../types/StaffType'
import PaymentType from '../types/PaymentType'
import { SectionType } from '../types/SectionType'
import { ServiceStores } from '../firebase/ServiceStore'

import { ServiceComments } from '../firebase/ServiceComments'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServicePayments } from '../firebase/ServicePayments'
import { ServiceSections } from '../firebase/ServiceSections'
import { PriceType } from '../types/PriceType'
import { ServicePrices } from '../firebase/ServicePrices'
import { CategoryType } from '../types/RentItem'
import { ServiceCategories } from '../firebase/ServiceCategories'
import useOrders from './useOrders'

function useStoreDataListen({ storeId }: { storeId: string }) {
  const { orders, handleGetSolvedOrders } = useOrders({ storeId })

  const [store, setStore] = useState<StoreType>(null)

  const [comments, setComments] = useState<CommentType[]>([])
  const [staff, setStaff] = useState<StaffType[]>([])
  const [payments, setPayments] = useState<PaymentType[]>([])
  const [sections, setSections] = useState<SectionType[]>([])
  const [prices, setPrices] = useState<PriceType[]>([])
  const [categories, setCategories] = useState<Partial<CategoryType>[]>([])

  useEffect(() => {
    if (storeId) {
      ServiceStores.listen(storeId, setStore)
    } else {
      setStore(null)
    }
  }, [storeId])

  useEffect(() => {
    if (store) {
      //* LISTENERS

      ServiceStaff.listenByStore(store.id, setStaff)
      ServiceSections.listenByStore(store.id, setSections)

      ServicePayments.listenByStore(store.id, setPayments)
      // ServiceOrders.listenByStore(store.id, setOrders)
      // ServiceComments.listenByStore(store.id, setComments)
      ServiceComments.listenStoreReports(store.id, setComments)

      //* GETS

      updateCategories()
    }
  }, [store])

  const updateCategories = async () => {
    await ServicePrices.getByStore(storeId).then(setPrices)
    await ServiceCategories.getByStore(storeId).then(setCategories)
  }

  const [formatCategories, setFormatCategories] = useState<
    Partial<CategoryType>[]
  >([])

  useEffect(() => {
    // console.log('prices or categories changed')
    const catsWithPrices = categories?.map((cat) => {
      const catPrices = prices?.filter((price) => price.categoryId === cat.id)
      return {
        ...cat,
        prices: catPrices
      }
    })
    setFormatCategories(catsWithPrices)
  }, [categories, prices])

  return {
    store,
    comments,
    staff,
    orders,
    payments,
    sections,
    prices,
    updateCategories,
    categories: formatCategories,
    handleGetSolvedOrders
  }
}

export default useStoreDataListen
