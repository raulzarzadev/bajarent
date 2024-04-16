import Tabs from './Tabs'
import ScreenCashbox from './ScreenCashbox'
import ScreenItems from './ScreenItems'
import ScreenStaff from './ScreenStaff'
import ScreenSections from './ScreenSections'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'
import Stats from './Stats'
import ErrorBoundary from './ErrorBoundary'
import ScreenComments from './ScreenComments'
import { Text, View } from 'react-native'
import StoreDetails from './StoreDetails'
import ListItemsStatus from './ListItemsStatus'
import ScreenItemsStatus from './ScreenItemsStatus'

const ScreenStoreA = (props) => {
  const { store, staffPermissions } = useStore()
  const { user } = useAuth()
  const isOwner = store?.createdBy === user?.id
  return (
    <Tabs
      defaultTab="Negocio"
      tabs={[
        {
          title: 'Negocio',
          content: <TabsBusiness {...props} />,
          show: isOwner || !!staffPermissions?.isAdmin
        },
        {
          title: 'Tienda',
          content: <TabsStore {...props} />,
          show: isOwner || !!staffPermissions?.isAdmin
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
  const { store, staffPermissions } = useStore()
  const { user } = useAuth()
  const isOwner = store?.createdBy === user?.id
  return (
    <Tabs
      tabs={[
        {
          title: 'Caja',
          content: <ScreenCashbox {...props} />,
          show: !!staffPermissions?.isAdmin || isOwner
        },
        {
          title: 'Articulos',
          content: <ScreenItems {...props} />,
          show: !!staffPermissions?.isAdmin || isOwner
        },
        {
          title: 'Staff',
          content: <ScreenStaff {...props} />,
          show: store?.allowStaff
        },
        {
          title: 'Areas',
          content: <ScreenSections {...props} />,
          show: store?.allowSections
        },
        {
          title: 'Config',
          content: <StoreDetails store={store} {...props} />,
          show: !!staffPermissions?.isAdmin || isOwner
        }
      ]}
    />
  )
}

const TabsBusiness = (props) => {
  return (
    <Tabs
      defaultTab="Comentarios"
      tabs={[
        {
          title: 'Comentarios',
          content: <ScreenComments {...props} />,
          show: true
        },
        {
          title: 'Clientes',
          content: (
            <View>
              <Text>Próximamente</Text>
            </View>
          ),
          show: true
        },
        {
          title: 'Artículos',
          content: <ScreenItemsStatus {...props} />,
          show: true
        },
        {
          title: 'Estadisticas',
          content: <Stats {...props} />,
          show: true
        }
      ]}
    />
  )
}

export default function ScreenStore(props) {
  return (
    <ErrorBoundary componentName="ScreenStore2">
      <ScreenStoreA {...props} />
    </ErrorBoundary>
  )
}
