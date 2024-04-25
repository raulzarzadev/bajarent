import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import OrderType from '../types/OrderType'

function ScreenOrders({ route }) {
  const { orders, handleToggleJustActiveOrders } = useStore()
  const preOrders = route?.params?.orders || null
  const [fullOrders, setFullOrders] = useState<OrderType[]>([])

  useEffect(() => {
    if (preOrders) {
      const filteredOrders = orders.filter(({ id }) => preOrders.includes(id))
      setFullOrders(filteredOrders)
    } else {
      setFullOrders(orders)
    }
  }, [orders])

  // const [disabledDownload, setDisabledDownload] = useState(false)
  // const getSolvedOrders = () => {
  //   handleGetSolvedOrders()
  //   setDisabledDownload(true)
  //   setTimeout(() => {
  //     setDisabledDownload(false)
  //   }, 5000)
  // }

  return (
    <ListOrders
      orders={fullOrders}
      //defaultOrdersIds={filtered}
      sideButtons={[
        {
          icon: 'download',
          label: '',
          onPress: handleToggleJustActiveOrders,
          visible: true
        }
      ]}
    />
  )
}

export default ScreenOrders
