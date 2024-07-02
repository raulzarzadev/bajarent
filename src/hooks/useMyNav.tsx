import { useNavigation } from '@react-navigation/native'

const useMyNav = () => {
  const { navigate } = useNavigation()
  const toItems = ({ id, screenNew }: { id?: string; screenNew?: boolean }) => {
    if (screenNew) {
      //@ts-ignore
      navigate('StackItems', {
        screen: 'ScreenItemNew'
      })
    } else if (id) {
      //@ts-ignore
      navigate('StackItems', {
        screen: 'ScreenItemsDetails',
        params: {
          id
        }
      })
    }
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
    toItems,
    toOrder
  }
}

export default useMyNav
