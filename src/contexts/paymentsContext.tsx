import React, { ReactNode, createContext, useState } from 'react'
import PaymentType from '../types/PaymentType'
import { ServicePayments } from '../firebase/ServicePayments'
import { useStore } from './storeContext'
import { useOrdersCtx } from './ordersContext'

// Define the shape of the context value
interface PaymentsContextValue {
  // Add your context properties and methods here
  payments: Partial<PaymentType[]>
  handleSetPayments: ({ list, days, lasCount, empty }) => void
}

// Create the context
export const PaymentsContext = createContext<PaymentsContextValue | undefined>(
  undefined
)

// Create the provider component
export const PaymentsProvider: React.FC = ({
  children
}: {
  children: ReactNode
}) => {
  const { consolidatedOrders } = useOrdersCtx()
  const { storeId } = useStore()
  // Add your state and methods here
  const [payments, setPayments] = useState<Partial<PaymentType[]>>([])
  const [list, setList] = useState<string[]>()
  const [days, setDays] = useState(1)
  const handleSetPayments = async (props?: {
    days?: number
    // lastCount: number
    list?: string[]
  }) => {
    setList(props?.list)
    setDays(props?.days)

    const _list = props?.list || list

    if (_list?.length) {
      const res = (await ServicePayments.list(_list).catch(console.error)) || []
      const paymentWithOrderData = res?.map((p) => {
        const consolidateOrder = consolidatedOrders?.orders?.[p.orderId]
        return {
          ...p,
          orderFolio: consolidateOrder?.folio as number, //* This is the line that is causing the error
          orderName: consolidateOrder?.fullName as string,
          orderNote: consolidateOrder?.note as string
        }
      })
      setPayments(paymentWithOrderData)
    } else {
      const res =
        (await ServicePayments.getLast(storeId, { days }).catch(
          console.error
        )) || []
      const paymentWithOrderData = res?.map((p) => {
        const consolidateOrder = consolidatedOrders?.orders?.[p.orderId]
        return {
          ...p,
          orderFolio: consolidateOrder?.folio as number, //* This is the line that is causing the error
          orderName: consolidateOrder?.fullName as string,
          orderNote: consolidateOrder?.note as string
        }
      })
      setPayments(paymentWithOrderData)
    }
    return
  }
  return (
    <PaymentsContext.Provider
      value={{
        payments,
        handleSetPayments
      }}
    >
      {children}
    </PaymentsContext.Provider>
  )
}

// Create a custom hook to access the context
export const usePayments = (): PaymentsContextValue => {
  const context = React.useContext(PaymentsContext)
  if (!context) {
    throw new Error('usePayments must be used within a PaymentsProvider')
  }
  return context
}
