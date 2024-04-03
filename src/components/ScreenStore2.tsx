import Tabs from './Tabs'
import ScreenCashbox from './ScreenCashbox'
import ScreenItems from './ScreenItems'
import ScreenStaff from './ScreenStaff'
import ScreenSections from './ScreenSections'
import ScreenStoreDetails from './ScreenStoreDetails'
import { useStore } from '../contexts/storeContext'
import { useAuth } from '../contexts/authContext'
import Stats from './Stats'

const ScreenStore = (props) => {
  const { store, staffPermissions } = useStore()
  const { user } = useAuth()
  const isOwner = store?.createdBy === user?.id
  return (
    <Tabs
      defaultTab="Gráficas"
      tabs={[
        {
          title: 'Tienda',
          content: <ScreenStoreDetails {...props} />,
          show: true
        },
        {
          title: 'Gráficas',
          content: <Stats {...props} />,
          show: true
        },
        {
          title: 'Caja',
          content: <ScreenCashbox {...props} />,
          show: staffPermissions?.isAdmin || isOwner
        },
        {
          title: 'Articulos',
          content: <ScreenItems {...props} />,
          show: staffPermissions?.isAdmin || isOwner
        },
        {
          title: 'Staff',
          content: <ScreenStaff {...props} />,
          show: store.allowStaff
        },
        {
          title: 'Areas',
          content: <ScreenSections {...props} />,
          show: store.allowSections
        }
      ]}
    />
  )
}

export default ScreenStore
