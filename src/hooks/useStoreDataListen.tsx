import { useEffect, useState } from 'react'
import StoreType from '../types/StoreType'
import OrderType from '../types/OrderType'
import { CommentType } from '../types/CommentType'
import StaffType from '../types/StaffType'
import PaymentType from '../types/PaymentType'
import { SectionType } from '../types/SectionType'
import { ServiceStores } from '../firebase/ServiceStore'
import { ServiceOrders } from '../firebase/ServiceOrders'
import { ServiceComments } from '../firebase/ServiceComments'
import { ServiceStaff } from '../firebase/ServiceStaff'
import { ServicePayments } from '../firebase/ServicePayments'
import { ServiceSections } from '../firebase/ServiceSections'
import { PriceType } from '../types/PriceType'
import { ServicePrices } from '../firebase/ServicePrices'
import { CategoryType } from '../types/RentItem'
import { ServiceCategories } from '../firebase/ServiceCategories'
import useCategories from './useCategories'

function useStoreDataListen({ storeId }: { storeId: string }) {
  const [store, setStore] = useState<StoreType>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
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
      ServicePayments.listenByStore(store.id, setPayments)
      ServiceOrders.listenByStore(store.id, setOrders)
      ServiceStaff.listenByStore(store.id, setStaff)
      ServiceSections.listenByStore(store.id, setSections)
      // ServiceComments.listenByStore(store.id, setComments)
      ServiceComments.listenStoreReports(store.id, setComments)
      ServicePrices.getByStore(store.id).then(setPrices)
      ServiceCategories.getByStore(store.id).then(setCategories)
    }
  }, [store])

  const updatePrices = async () => {
    ServicePrices.getByStore(storeId).then(setPrices)
  }

  // const updateCategories = async () => {
  //   ServiceCategories.getByStore(storeId).then()
  // }

  return {
    store,
    comments,
    staff,
    orders,
    payments,
    sections,
    prices,
    updatePrices,
    categories
  }
}

export default useStoreDataListen
