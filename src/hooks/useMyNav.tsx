import { useNavigation } from '@react-navigation/native'

const useMyNav = () => {
  const { navigate } = useNavigation()
  const toItems = ({
    id,
    screenNew,
    screenEdit,
    ids,
    to
  }: {
    to?: 'new' | 'edit' | 'details' | 'newOrder' | 'customerOrder'
    id?: string
    screenNew?: boolean
    screenEdit?: boolean
    ids?: string[]
  }) => {
    if (to === 'details' && id) {
      //@ts-ignore
      navigate('StackItems', {
        screen: 'ScreenItemsDetails',
        params: {
          id
        }
      })
      return
    }
    if (to === 'edit' && id) {
      //@ts-ignore
      navigate('StackItems', {
        screen: 'ScreenItemEdit',
        params: {
          id
        }
      })
      return
    }
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

  const toCustomers = (props: ToCustomersType) => {
    if (props.to === 'customerOrder' && props.orderId) {
      //@ts-ignore
      navigate('StackOrders', {
        screen: 'OrderDetails',
        params: {
          orderId: props.orderId
        }
      })
    }
    if (props?.to === 'newOrder' && props?.customerId) {
      //@ts-ignore
      navigate('StackOrders', {
        screen: 'ScreenNewOrder',
        params: {
          customerId: props?.customerId
        }
      })
    }
    if (props.to === 'new') {
      //@ts-ignore
      navigate('StackCustomers', {
        screen: 'ScreenCustomerNew'
      })
    }

    if (props.to === 'details' && props.id) {
      //@ts-ignore
      navigate('StackCustomers', {
        screen: 'ScreenCustomer',
        params: {
          id: props.id
        }
      })
    }
    if (props.to === 'edit' && props.id) {
      //@ts-ignore
      navigate('StackCustomers', {
        screen: 'ScreenCustomerEdit',
        params: {
          id: props.id
        }
      })
    }
  }
  type ToOrdersType = {
    id?: string
    ids?: string[]
    screenNew?: boolean
    idsTitle?: string
    screen?: 'renew'
    customerId?: string
    to?: 'new' | 'details' | 'edit'
  }
  const toOrders = ({
    id,
    ids,
    screenNew,
    idsTitle,
    screen,
    customerId,
    to
  }: ToOrdersType = {}) => {
    if (to === 'new') {
      //@ts-ignore
      navigate('StackOrders', {
        screen: 'ScreenNewOrder',
        params: {
          customerId
        }
      })
      return
    }
    if (screen === 'renew') {
      //@ts-ignore
      navigate('StackOrders', {
        screen: 'RenewOrder',
        params: {
          orderId: id
        }
      })
      return
    }
    if (Array.isArray(ids) && ids.length > 0) {
      //@ts-ignore
      navigate('StackOrders', {
        screen: 'ScreenSelectedOrders',
        params: {
          title: idsTitle || 'Ordenes seleccionadas',
          orders: ids
        }
      })
    }

    if (screenNew) {
      //@ts-ignore
      navigate('NewOrder', {
        customerId
      })
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
        screen: 'ScreenSectionsNew'
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
    toMessages,
    toCustomers
  }
}

export type ToCustomersType =
  | {
      to: 'new'
      customerId?: string
    }
  | {
      to: 'details'
      id: string
    }
  | {
      to: 'edit'
      id: string
    }
  | {
      to: 'newOrder'
      customerId: string
    }
  | {
      to: 'customerOrder'
      orderId: string
    }

export default useMyNav
