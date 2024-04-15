import Tabs from './Tabs'
import ScreenCashbox from './ScreenCashbox'
import ScreenItems from './ScreenItems'
import ScreenStaff from './ScreenStaff'
import ScreenSections from './ScreenSections'
import { useStore } from '../contexts/storeContext'
import Stats from './Stats'
import ErrorBoundary from './ErrorBoundary'
import ScreenComments from './ScreenComments'
import { Text, View } from 'react-native'
import StoreDetails from './StoreDetails'
import ScreenItemsStatus from './ScreenItemsStatus'
import { useEmployee } from '../contexts/employeeContext'

const ScreenStore = (props) => {
  return (
    <Tabs
      defaultTab="Negocio"
      tabs={[
        {
          title: 'Negocio',
          content: <TabsBusiness {...props} />,
          show: true
        },
        {
          title: 'Tienda',
          content: <TabsStore {...props} />,
          show: true
        }
        // {
        //   title: 'Mercado',
        //   content: <ScreenStoreDetails {...props} />,
        //   show: true
        // }
      ]}
    />
  )
}

const TabsStore = (props) => {
  const { store } = useStore()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()
  return (
    <Tabs
      tabs={[
        {
          title: 'Caja',
          content: <ScreenCashbox {...props} />,
          show: isAdmin || isOwner
        },
        {
          title: 'Articulos',
          content: <ScreenItems {...props} />,
          show: isAdmin || isOwner
        },
        {
          title: 'Staff',
          content: <ScreenStaff {...props} />,
          show: store?.allowStaff && (isAdmin || isOwner)
        },
        {
          title: 'Areas',
          content: <ScreenSections {...props} />,
          show: store?.allowSections && (isAdmin || isOwner)
        },
        {
          title: 'Config',
          content: <StoreDetails store={store} {...props} />,
          show: isAdmin || isOwner
        }
      ]}
    />
  )
}

const TabsBusiness = (props) => {
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()

  const canViewComments = isAdmin || isOwner
  const canViewClients = isAdmin || isOwner
  const canViewItemsStats = isAdmin || isOwner
  const canViewStoreStats = isAdmin || isOwner

  return (
    <Tabs
      defaultTab="Comentarios"
      tabs={[
        {
          title: 'Comentarios',
          content: <ScreenComments {...props} />,
          show: canViewComments
        },
        {
          title: 'Clientes',
          content: (
            <View>
              <Text>Próximamente</Text>
            </View>
          ),
          show: canViewClients
        },
        {
          title: 'Artículos',
          content: <ScreenItemsStatus {...props} />,
          show: canViewItemsStats
        },
        {
          title: 'Estadisticas',
          content: <Stats {...props} />,
          show: canViewStoreStats
        }
      ]}
    />
  )
}

export default ScreenStore

export const ScreenStoreE = (props) => {
  return (
    <ErrorBoundary componentName="ScreenStore4">
      <ScreenStore {...props} />
    </ErrorBoundary>
  )
}
