import * as Linking from 'expo-linking'

type LinkingConfig = {
  prefixes: string[]
  config: {
    screens: Record<string, any>
  }
}

const prefix = Linking.createURL('/')

export const linking: LinkingConfig = {
  prefixes: [prefix],
  config: {
    screens: {
      Store: {
        screens: {
          StoreHome: '',
          StackSections: {
            screens: {
              ScreenSectionsNew: 'sections/new',
              ScreenSectionsEdit: 'sections/:id/edit',
              ScreenSectionSDetails: 'sections/:id'
            }
          },
          StackBalances: {
            screens: {
              ScreenBalances: 'balances',
              ScreenBalance_v3: 'balances/:balanceId'
            }
          },
          StackOrders: {
            screens: {
              ScreenOrders: 'store/orders'
            }
          },
          StackPayments: {
            screens: {
              ScreenPayments: 'store/payments',
              ScreenPaymentsDetails: 'store/payments/:id'
            }
          },
          StackItems: {
            screens: {
              ScreenItems: 'store/items'
            }
          }
        }
      },
      StackOrders: {
        screens: {
          ScreenOrders: 'orders',
          OrderDetails: 'orders/:orderId',
          ScreenNewOrder: 'orders/new',
          ScreenSelectedOrders: 'orders/selected'
        }
      },
      StackCustomers: {
        screens: {
          ScreenCustomers: 'customers',
          ScreenCustomer: 'customers/:id',
          ScreenCustomerNew: 'customers/new',
          ScreenCustomerEdit: 'customers/:id/edit'
        }
      },
      StackMyItems: {
        screens: {
          ScreenItems: 'my-items'
        }
      },
      Workshop: {
        screens: {
          WorkshopHome: 'workshop',
          WorkshopHistory: 'workshop/history'
        }
      },
      Profile: 'profile',
      Components: 'components',
      StackItems: {
        screens: {
          ScreenItems: 'items',
          ScreenItemNew: 'items/new',
          ScreenItemsDetails: 'items/:id'
        }
      },
      StackPayments: {
        screens: {
          ScreenPayments: 'payments',
          ScreenPaymentsDetails: 'payments/:id'
        }
      }
    }
  }
}
