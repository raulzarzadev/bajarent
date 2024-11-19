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
      navigate('StackMyItems', {
        screen: 'ScreenItems',
        params: {
          ids
        }
      })
    }
    if (screenEdit && id) {
      //@ts-ignore
      navigate('StackMyItems', {
        screen: 'ScreenItemEdit',
        params: {
          id
        }
      })
      return
    }

    if (screenNew) {
      //@ts-ignore
      navigate('StackMyItems', {
        screen: 'ScreenItemNew'
      })
      return
    } else if (id) {
      //@ts-ignore
      navigate('StackMyItems', {
        screen: 'ScreenItemsDetails',
        params: {
          id
        }
      })
      return
    }
  }
  const toPayments = ({
    id,
    ids,
    idsTitle
  }: {
    id?: string
    ids?: string[]
    idsTitle?: string
  }) => {
    if (Array.isArray(ids) && ids.length > 0) {
      //@ts-ignore
      navigate('StackPayments', {
        screen: 'ScreenPayments',
        params: {
          title: idsTitle || 'Pagos',
          payments: ids
        }
      })
    }

    if (id) {
      //@ts-ignore
      navigate('StackPayments', {
        screen: 'ScreenPaymentsDetails',
        params: {
          id
        }
      })
      return
    }
  }
  const toWorkshop = () => {
    //@ts-ignore
    navigate('WorkshopHistory')
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
  const toProfile = () => {
    //@ts-ignore
    navigate('Profile')
  }

  const toSections = ({
    id,
    screenNew,
    screenEdit
  }: {
    id?: string
    screenNew?: boolean
    screenEdit?: boolean
  }) => {
    if (screenEdit && id) {
      //@ts-ignore
      navigate('StackSections', {
        screen: 'ScreenSectionsEdit',
        params: {
          id
        }
      })
      return
    }

    if (screenNew) {
      //@ts-ignore
      navigate('StackSections', {
        screen: 'ScreenSectionSNew'
      })
      return
    } else if (id) {
      //@ts-ignore
      navigate('StackSections', {
        screen: 'ScreenSectionSDetails',
        params: {
          id
        }
      })
      return
    }
  }
  const toMessages = () => {
    //@ts-ignore
    navigate('ScreenMessages')
  }

  return {
    toItems,
    toOrders,
    toPayments,
    toProfile,
    toSections,
    toWorkshop,
    toMessages
  }
}

export default useMyNav
