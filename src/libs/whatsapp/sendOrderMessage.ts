import { arrayUnion } from 'firebase/firestore'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import sendMessage from './sendMessage'
import OrderType, {
  OrderExtensionType,
  SentMessage
} from '../../types/OrderType'
import StoreType from '../../types/StoreType'
import { rentFinished, rentRenewed, rentStarted } from '../whatsappMessages'
import chooseOrderPhone from './chooseOrderPhone'
import PaymentType from '../../types/PaymentType'

/**
 * @deprecated use onSendOrderWhatsapp instead
 */
const sendOrderMessage = async ({
  orderId,
  userId,
  message,
  apiKey,
  botId,
  phone
}) => {
  return sendMessage({
    phone,
    message,
    apiKey,
    botId
  })
    .then((res) => {
      const sentMessage: SentMessage = {
        message,
        sentAt: new Date(),
        number: phone,
        sentBy: userId
      }
      return ServiceOrders.update(orderId, {
        //@ts-ignore
        sentMessages: arrayUnion(sentMessage)
      })
    })
    .catch((e) => {
      console.error(e)
    })
}

export const onSendOrderWhatsapp = ({
  store,
  order,
  type,
  userId,
  lastPayment
}: {
  store: StoreType
  order: Partial<OrderType>
  type: 'renew' | 'delivery' | 'pickup'
  userId: string
  lastPayment?: PaymentType
}) => {
  if (!store.chatbot.enabled) return console.log('bot is disabled')
  if (!store.chatbot.apiKey) return console.log('bot api key is missing')
  if (!store.chatbot.id) return console.log('bot id is missing')

  let message = ''
  if (type === 'renew') {
    message = rentRenewed({
      order,
      storeName: store.name,
      lastPayment: lastPayment || order.payments[0]
    })
  } else if (type === 'delivery') {
    message = rentStarted({
      order,
      storeName: store.name,
      lastPayment: lastPayment || order.payments[0]
    })
  } else if (type === 'pickup') {
    message = rentFinished({
      order,
      storeName: store.name
    })
  }

  sendMessage({
    phone: chooseOrderPhone(order),
    message,
    apiKey: store.chatbot.apiKey,
    botId: store.chatbot.id
  })
    .then((res) => {
      const sentMessage: SentMessage = {
        message,
        sentAt: new Date(),
        number: chooseOrderPhone(order),
        sentBy: userId
      }
      return ServiceOrders.update(order.id, {
        //@ts-ignore
        sentMessages: arrayUnion(sentMessage)
      })
    })
    .catch((e) => {
      console.error(e)
    })
}

export default sendOrderMessage
