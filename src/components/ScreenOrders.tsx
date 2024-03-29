import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import OrderType from '../types/OrderType'

function ScreenOrders({ navigation, route }) {
  const { orders, handleGetSolvedOrders } = useStore()
  const [filtered, setFiltered] = useState<string[]>([])
  const filter = route?.params?.orders || []
  const [fullOrders, setFullOrders] = useState<OrderType[]>([])

  useEffect(() => {
    if (filter.length > 0)
      setFiltered(
        orders.filter((o) => filter.includes(o.id)).map((o) => o.id) || []
      )
  }, [filter])

  useEffect(() => {
    setFullOrders(orders)
  }, [orders])

  const [disabledDownload, setDisabledDownload] = useState(false)
  const getSolvedOrders = () => {
    handleGetSolvedOrders()
    setDisabledDownload(true)
    setTimeout(() => {
      setDisabledDownload(false)
    }, 5000)
  }
  return (
    <>
      <ListOrders
        orders={fullOrders}
        defaultOrdersIds={filtered}
        sideButtons={[
          {
            icon: 'download',
            label: '',
            onPress: getSolvedOrders,
            visible: true,
            disabled: true
          }
        ]}
      />
    </>
  )
}

export default ScreenOrders
