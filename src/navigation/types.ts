import { NavigatorScreenParams } from '@react-navigation/native'

export type PaymentsStackParamList = {
  ScreenPayments: { title?: string; payments?: string[] } | undefined
  ScreenPaymentsDetails: { id: string; title?: string }
  ScreenRetirementsNew: { title?: string } | undefined
}

export type OrdersStackParamList = {
  ScreenOrders: { title?: string } | undefined
  OrderDetails: { orderId?: string; title?: string } | undefined
  EditOrder: { orderId?: string } | undefined
  AssignOrder: { orderId?: string } | undefined
  RenewOrder: { orderId?: string } | undefined
  ReorderOrder: { orderId?: string } | undefined
  ScreenNewOrder: { customerId?: string } | undefined
  ScreenSelectedOrders: { title?: string; orders?: string[] } | undefined
  StackCustomers:
    | { screen?: string; params?: Record<string, unknown> }
    | undefined
  StackPayments: NavigatorScreenParams<PaymentsStackParamList> | undefined
  StackItems: { screen?: string; params?: Record<string, unknown> } | undefined
  ScreenMessages: { title?: string } | undefined
  StackCurrentWork:
    | { screen?: string; params?: Record<string, unknown> }
    | undefined
}

export type BalancesStackParamList = {
  ScreenBalances: undefined
  ScreenBalancesNew: undefined
  CustomBalanceDate: undefined
  ScreenBalancesDetails: { balanceId?: string; title?: string } | undefined
  ScreenBalance_v3: { balanceId?: string; title?: string } | undefined
  StackOrders:
    | {
        screen?: keyof OrdersStackParamList
        params?: OrdersStackParamList[keyof OrdersStackParamList]
      }
    | undefined
  StackPayments:
    | {
        screen?: keyof PaymentsStackParamList
        params?: PaymentsStackParamList[keyof PaymentsStackParamList]
      }
    | undefined
}

export type ItemsStackParamList = {
  ScreenItems: { ids?: string[] } | undefined
  ScreenItemNew: undefined
  ScreenItemsDetails: { id: string }
  ScreenItemEdit: { id: string }
}

export type MyItemsStackParamList = {
  ScreenItems: undefined
  StackItems: NavigatorScreenParams<ItemsStackParamList> | undefined
}

export type StoreStackParamList = {
  StoreHome: { storeId?: string } | undefined
  CreateStore: undefined
  EditStore: undefined
  ScreenOrdersConfig: undefined
  StackSections:
    | { screen?: string; params?: Record<string, unknown> }
    | undefined
  StackStaff: { screen?: string; params?: Record<string, unknown> } | undefined
  StackBalances:
    | {
        screen?: keyof BalancesStackParamList
        params?: BalancesStackParamList[keyof BalancesStackParamList]
      }
    | undefined
  StackOrders:
    | {
        screen?: keyof OrdersStackParamList
        params?: OrdersStackParamList[keyof OrdersStackParamList]
      }
    | undefined
  StackPayments:
    | {
        screen?: keyof PaymentsStackParamList
        params?: PaymentsStackParamList[keyof PaymentsStackParamList]
      }
    | undefined
  StackItems:
    | {
        screen?: keyof ItemsStackParamList
        params?: ItemsStackParamList[keyof ItemsStackParamList]
      }
    | undefined
  CreateCategory: undefined
  EditCategory: undefined
  ScreenItemsMap: undefined
}

export type CustomersStackParamList = {
  ScreenCustomers: undefined
  ScreenCustomer: { id: string }
  ScreenCustomerNew: undefined
  ScreenCustomerEdit: { id?: string } | undefined
  StackOrders:
    | {
        screen?: keyof OrdersStackParamList
        params?: OrdersStackParamList[keyof OrdersStackParamList]
      }
    | undefined
}

export type WorkshopStackParamList = {
  WorkshopHome: undefined
  WorkshopHistory: undefined
  StackOrders:
    | {
        screen?: keyof OrdersStackParamList
        params?: OrdersStackParamList[keyof OrdersStackParamList]
      }
    | undefined
  StackMyItems:
    | {
        screen?: keyof MyItemsStackParamList
        params?: MyItemsStackParamList[keyof MyItemsStackParamList]
      }
    | undefined
  StackItems:
    | {
        screen?: keyof ItemsStackParamList
        params?: ItemsStackParamList[keyof ItemsStackParamList]
      }
    | undefined
}

export type RootTabParamList = {
  Store: NavigatorScreenParams<StoreStackParamList> | undefined
  StackMyItems: NavigatorScreenParams<MyItemsStackParamList> | undefined
  Workshop: NavigatorScreenParams<WorkshopStackParamList> | undefined
  StackOrders: NavigatorScreenParams<OrdersStackParamList> | undefined
  StackCustomers: NavigatorScreenParams<CustomersStackParamList> | undefined
  Profile: undefined
  Components: undefined
  StackItems: NavigatorScreenParams<ItemsStackParamList> | undefined
}
