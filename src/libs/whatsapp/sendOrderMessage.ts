import { arrayUnion } from 'firebase/firestore'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import sendMessage from './sendMessage'
import OrderType, { SentMessage } from '../../types/OrderType'
import StoreType from '../../types/StoreType'
import {
  expiredMessage,
  orderStatus,
  rentFinished,
  rentRenewed,
  rentStarted
} from '../whatsappMessages'
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

export type TypeOfMessage =
  | 'renew'
  | 'delivery'
  | 'pickup'
  | 'status'
  | 'expire'
export const onSendOrderWhatsapp = async ({
  store,
  order,
  type,
  userId,
  lastPayment
}: {
  store: StoreType
  order: Partial<OrderType>
  type: TypeOfMessage
  userId: string
  lastPayment?: PaymentType
}) => {
  const { isValid, message: validationMessage } = validateChatbotConfig({
    chatbot: store.chatbot,
    messageType: type
  })

  if (!isValid) return console.log(validationMessage)

  const messageOptions: Record<TypeOfMessage, string> = {
    status: orderStatus({
      order,
      storeName: store.name
    }),
    renew: rentRenewed({
      order,
      storeName: store.name,
      lastPayment: lastPayment || order.payments[0]
    }),
    delivery: rentStarted({
      order,
      storeName: store.name,
      lastPayment: lastPayment || order.payments[0]
    }),
    pickup: rentFinished({
      order,
      storeName: store.name
    }),
    expire: expiredMessage({
      order,
      store
    })
  }

  const staffName = store.staff.find((s) => s.userId === userId)?.position

  let message = messageOptions[type]

  if (staffName && store?.chatbot?.config?.includeSender)
    message = message + `👤 ${staffName}`

  return await sendMessage({
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

export type ChatbotValidationResult = {
  message: string
  isValid: boolean
}
const validateChatbotConfig = ({
  chatbot,
  messageType
}: {
  chatbot: StoreType['chatbot']
  messageType: TypeOfMessage
}): ChatbotValidationResult => {
  let message = 'message is not enabled' // * <--- default message is not enabled
  let isValid = false // * <--- default validate value is false

  if (!chatbot.enabled) message = 'chatbot is disabled'
  if (!chatbot.apiKey) message = 'chatbot api key is missing'
  if (!chatbot.id) message = 'chatbot id is missing'
  if (!chatbot.config) message = 'chatbot config is missing'

  if (!chatbot.config.sendDelivered) message = 'delivery message is disabled'
  if (!chatbot.config.sendPickedUp) message = 'pickup message is disabled'
  if (!chatbot.config.sendRenewed) message = 'renew message is disabled'

  if (chatbot.config.sendDelivered && messageType === 'delivery') {
    message = 'delivery message is enabled'
    isValid = true
  }
  if (chatbot.config.sendPickedUp && messageType === 'pickup') {
    message = 'pickup message is enabled'
    isValid = true
  }
  if (chatbot.config.sendRenewed && messageType === 'renew') {
    message = 'renew message is enabled'
    isValid = true
  }

  return {
    message,
    isValid
  }
}

export default sendOrderMessage
