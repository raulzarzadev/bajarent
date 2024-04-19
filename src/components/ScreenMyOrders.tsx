import { useState } from 'react'
import { useStore } from '../contexts/storeContext'
import ListOrders from './ListOrders'
import WeekOrdersTimeLine from './WeekOrdersTimeLine'
import { View } from 'react-native'
import Button from './Button'
import { gSpace } from '../styles'
import { useNavigation } from '@react-navigation/native'
import { useEmployee } from '../contexts/employeeContext'

type ViewType = 'list' | 'timeline'

function ScreenMyOrders({ navigation }) {
  const { myOrders } = useStore()
  const { orders } = useEmployee()
  const [view, setView] = useState<ViewType>('list')

  const handleSwitchView = () => {
    setView(view === 'list' ? 'timeline' : 'list')
  }

  const { navigate } = useNavigation()

  return (
    <>
      {view === 'list' && (
        <ListOrders
          orders={orders}
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
              marginVertical: gSpace(1),
              maxWidth: 200,
              marginHorizontal: 'auto',
              marginBottom: 0
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
              navigate('Orders')
              // @ts-ignore
              navigate('OrderDetails', { orderId: id })
            }}
          />
        </>
      )}
    </>
  )
}

export default ScreenMyOrders
