import { useEffect, useState } from 'react'
import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import OrderType from '../types/OrderType'

function ScreenOrders({ route, navigation: { navigate } }) {
  useStore() //*<---- FIXME: if you remove this everything will break

  // const {
  //   orders,
  //   handleToggleJustActiveOrders,
  //   fetchOrders,
  //   justActiveOrders
  // } = useStore()
  // const preOrders = route?.params?.orders || null
  // const [fullOrders, setFullOrders] = useState<OrderType[]>([])
  // useEffect(() => {
  //   // if (preOrders) {
  //   //   const filteredOrders = orders.filter(({ id }) => preOrders.includes(id))
  //   //   setFullOrders(filteredOrders)
  //   // } else {
  //   //   setFullOrders(orders)
  //   // }
  // }, [orders])

  const [disabled, setDisabled] = useState(false)
  // const debouncedFetchOrders = () => {
  //   setDisabled(true)
  //   fetchOrders()
  //   setTimeout(() => {
  //     setDisabled(false)
  //   }, 3000) //<-- 3 seconds
  // }

  console.log({ ordersIds: route?.params?.orders })

  return (
    <ListOrders
      orders={[]}
      //defaultOrdersIds={filtered}

      sideButtons={[
        // {
        //   icon: 'download',
        //   label: '',
        //   onPress: handleToggleJustActiveOrders,
        //   visible: justActiveOrders
        // },
        // {
        //   icon: 'upload',
        //   label: '',
        //   onPress: handleToggleJustActiveOrders,
        //   visible: !justActiveOrders
        // },
        // {
        //   icon: 'refresh',
        //   label: '',
        //   onPress: debouncedFetchOrders,
        //   visible: true,
        //   disabled: disabled
        // },
        {
          icon: 'add',
          label: '',
          onPress: () => {
            // @ts-ignore
            navigate('NewOrder')
          },
          visible: true
        }
      ]}
    />
  )
}

export default ScreenOrders
