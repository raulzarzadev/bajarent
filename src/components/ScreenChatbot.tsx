import { View, Text } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import StoreType, {
  bot_configs,
  bot_configs_order_flow
} from '../types/StoreType'
import { useStore } from '../contexts/storeContext'
import { messageOptions } from '../libs/whatsapp/sendOrderMessage'
import OrderType, { order_type } from '../types/OrderType'
import { Payment } from '../libs/paymentsUtils'
import { FormChatbotE } from './FormChatbot'
import { ServiceStores } from '../firebase/ServiceStore'
import theme from '../theme'
const ScreenChatbot = (props?: ScreenChatbotProps) => {
  const { store } = useStore()
  const handleUpdateChatbot = async (values: { chatbot: any }) => {
    return await ServiceStores.update(store.id, { chatbot: values.chatbot })
  }
  return (
    <View>
      <FormChatbotE
        values={store.chatbot}
        onSubmit={(chatbot) => handleUpdateChatbot({ chatbot })}
      />
      <SampleMessages store={store} />
    </View>
  )
}
export const SampleMessages = ({ store }: { store: StoreType }) => {
  return (
    <View>
      <Text style={gStyles.h2}>Mensajes de muestra</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Object.entries(bot_configs_order_flow).map(([key, value]) => (
          <View
            key={key}
            style={{
              width: 200,
              marginHorizontal: 'auto',
              padding: 4,
              margin: 4,
              borderRadius: 8,
              backgroundColor: theme.white
            }}
          >
            <Text style={gStyles.h3}>
              {store?.chatbot?.config?.[key] ? '✅' : '❌'}
              {value}
            </Text>
            <Text>
              {
                messageOptions({
                  order: mockOrder,
                  lastPayment: mockPayment,
                  store
                })[key]
              }
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
export const ChatbotStatus = ({ chatbot }) => {
  return (
    <>
      {!chatbot?.enabled && <Text>El chatbot esta desactivado</Text>}
      {chatbot?.enabled && (
        <View>
          <View>
            <Text style={[gStyles.h3, { marginTop: 8 }]}>Chatbot</Text>
            <Text style={gStyles.tCenter}>
              Status: {chatbot?.enabled ? '✅' : '❌'}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {Object.entries(bot_configs).map(([key, value]) => (
                <View key={key}>
                  <Text style={[gStyles.tCenter, { marginRight: 4 }]}>
                    <Text style={gStyles.tBold}>
                      {chatbot?.config?.[key] ? '✅' : '❌'}
                    </Text>
                    {value}{' '}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </>
  )
}
const mockOrder: Partial<OrderType> = {
  fullName: 'John Doe',
  customerName: 'John Doe',
  folio: 123,
  type: order_type.RENT,
  expireAt: new Date(),
  deliveredAt: new Date(),

  items: [
    {
      brand: 'Maytag',
      number: '00023'
    }
  ]
}
const mockPayment: Partial<Payment> = {
  amount: 100,
  method: 'cash'
}
export default ScreenChatbot
export type ScreenChatbotProps = {}
export const ScreenChatbotE = (props: ScreenChatbotProps) => (
  <ErrorBoundary componentName="ScreenChatbot">
    <ScreenChatbot {...props} />
  </ErrorBoundary>
)
