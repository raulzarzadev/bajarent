import { useNavigation } from '@react-navigation/native'

const useMyNav = () => {
  const { navigate } = useNavigation()
  const toItems = ({
    id,
    screenNew,
    screenEdit,
    ids
  }: {
    id?: string
    screenNew?: boolean
    screenEdit?: boolean
    ids?: string[]
  }) => {
    if (Array.isArray(ids) && ids.length > 0) {
      //@ts-ignore
      navigate('StackItems', {
        screen: 'ScreenItems',
        params: {
          ids
        }
      })
    }
    if (screenEdit && id) {
      //@ts-ignore
      navigate('StackItems', {
        screen: 'ScreenItemEdit',
        params: {
          id
        }
      })
      return
    }

    if (screenNew) {
      //@ts-ignore
      navigate('StackItems', {
        screen: 'ScreenItemNew'
      })
      return
    } else if (id) {
      //@ts-ignore
      navigate('StackItems', {
        screen: 'ScreenItemsDetails',
        params: {
          id
        }
      })
      return
    }
  }
  const toOrders = ({
    id,
    ids,
    screenNew,
    idsTitle
  }: {
    id?: string
    ids?: string[]
    screenNew?: boolean
    idsTitle?: string
  }) => {
    if (Array.isArray(ids) && ids.length > 0) {
      //@ts-ignore
      navigate('StackOrders', {
        screen: 'ScreenOrders',
        params: {
          title: idsTitle || 'Ordenes',
          orders: ids
        }
      })
    }
    if (screenNew) {
      //@ts-ignore
      navigate('NewOrder')
      return
    }
    if (id) {
      //@ts-ignore
      navigate('StackOrders', {
        screen: 'OrderDetails',
        params: {
          orderId: id
        }
      })
      return
    }
  }
  return {
    toItems,
    toOrders
  }
}

export default useMyNav
