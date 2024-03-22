import { useState } from 'react'
import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import WeekOrdersTimeLine from './WeekOrdersTimeLine'
import { View } from 'react-native'
import Button from './Button'
import { gSpace } from '../styles'
import { useNavigation } from '@react-navigation/native'
type ViewType = 'list' | 'timeline'

function ScreenMyOrders({ navigation }) {
  const { myOrders } = useStore()
  const [view, setView] = useState<ViewType>('list')
  const handleSwitchView = () => {
    setView(view === 'list' ? 'timeline' : 'list')
  }
  const { navigate } = useNavigation()

  return (
    <View>
      {view === 'list' && (
        <ListOrders
          orders={myOrders}
          sideButtons={[
            {
              // @ts-ignore
              icon: view === 'timeline' ? 'list' : 'calendar',
              label: '',
              onPress: handleSwitchView,
              visible: true,
              disabled: false
            }
          ]}
        />
      )}
      {view === 'timeline' && (
        <>
          <View
            style={{
              marginVertical: gSpace(2),
              maxWidth: 200,
              marginHorizontal: 'auto'
            }}
          >
            <Button
              size="xs"
              label={` ${view === 'timeline' ? 'Lista' : 'Calendario'}`}
              onPress={handleSwitchView}
              icon={view === 'timeline' ? 'list' : 'calendar'}
            ></Button>
          </View>
          <WeekOrdersTimeLine
            orders={myOrders}
            onPressOrder={(id) => {
              // @ts-ignore
              // navigate('OrdersDetails', { orderId: id })
              navigate('Orders')
              // @ts-ignore
              navigate('OrderDetails', { orderId: id })
            }}
          />
        </>
      )}
    </View>
  )
}

export default ScreenMyOrders
