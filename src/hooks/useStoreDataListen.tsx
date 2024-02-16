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

function useStoreDataListen({ storeId }: { storeId: string }) {
  const [store, setStore] = useState<StoreType>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [comments, setComments] = useState<CommentType[]>([])
  const [staff, setStaff] = useState<StaffType[]>([])
  const [payments, setPayments] = useState<PaymentType[]>([])
  const [sections, setSections] = useState<SectionType[]>([])

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
      ServiceComments.listenByStore(store.id, setComments)
    }
  }, [store])

  return {
    store,
    comments,
    staff,
    orders,
    payments,
    sections
  }
}

export default useStoreDataListen
