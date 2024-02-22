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

function useStoreData({ storeId }: { storeId: string }) {
  const [store, setStore] = useState<StoreType>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [comments, setComments] = useState<CommentType[]>([])
  const [staff, setStaff] = useState<StaffType[]>([])
  const [payments, setPayments] = useState<PaymentType[]>([])
  const [sections, setSections] = useState<SectionType[]>([])

  useEffect(() => {
    if (storeId) {
      updateStore()
    } else {
      setStore(null)
    }
  }, [storeId])

  useEffect(() => {
    if (store) {
      updatePayments()
      updateOrders()
      updateStaff()
      updateSections()
      updateComments()
    } else {
      setOrders([])
      setComments([])
      setStaff([])
      setPayments([])
      setSections([])
    }
  }, [store])

  const updatePayments = () => {
    if (store.id)
      ServicePayments.getByStore(store.id)
        .then(setPayments)
        .catch(console.error)
  }
  const updateOrders = () => {
    if (store.id)
      ServiceOrders.getByStore(store.id).then(setOrders).catch(console.error)
  }
  const updateStaff = () => {
    if (store.id)
      ServiceStaff.getByStore(store.id).then(setStaff).catch(console.error)
  }

  const updateSections = () => {
    if (store.id)
      ServiceSections.getByStore(store.id)
        .then(setSections)
        .catch(console.error)
  }
  const updateComments = () => {
    if (store.id)
      ServiceComments.getByStore(store.id)
        .then(setComments)
        .catch(console.error)
  }

  const updateOrder = (id: string) => {
    ServiceOrders.get(id).then((o) => {
      if (orders.some((order) => order.id === o.id)) {
        setOrders(orders.map((order) => (order.id === o.id ? o : order)))
      } else {
        setOrders([...orders, o])
      }
    })
  }

  const updateStore = () => {
    ServiceStores.get(storeId).then((store) => {
      setStore(store)
    })
  }

  return {
    store,
    comments,
    staff,
    orders,
    payments,
    sections,
    updateStore,
    updatePayments,
    updateOrders,
    updateStaff,
    updateSections,
    updateComments,
    updateOrder
  }
}

export default useStoreData
