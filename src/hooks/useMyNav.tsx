import { useNavigation } from '@react-navigation/native'

const useMyNav = () => {
  const { navigate } = useNavigation()
  const toItem = ({ id }: { id: string }) => {
    //@ts-ignore
    navigate('StackItems', {
      screen: 'ItemDetails',
      params: {
        id
      }
    })
  }
  const toOrder = ({ id }: { id: string }) => {
    //@ts-ignore
    navigate('StackOrders', {
      screen: 'OrderDetails',
      params: {
        orderId: id
      }
    })
  }
  return {
    toItem,
    toOrder
  }
}

export default useMyNav
