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
  phone: defaultPhone,
  type,
  userId,
  lastPayment
}: {
  store: StoreType
  phone?: string
  order: Partial<OrderType>
  type: TypeOfMessage
  userId: string
  lastPayment?: PaymentType
}): Promise<{
  success: boolean
  error?: string
}> => {
  const { isValid, message: validationMessage } = validateChatbotConfig({
    chatbot: store?.chatbot,
    messageType: type
  })

  if (!isValid)
    return {
      success: false,
      error: validationMessage
    }

  const messageOptions: Record<TypeOfMessage, string> = {
    status: orderStatus({
      order,
      storeName: store.name
    }),
    renew: rentRenewed({
      order,
      storeName: store.name,
      lastPayment: lastPayment || order?.payments?.[0] || null
    }),
    delivery: rentStarted({
      order,
      storeName: store.name,
      lastPayment: lastPayment || order?.payments?.[0] || null
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

  const staffName = store?.staff?.find((s) => s.userId === userId)?.position
  let message = messageOptions[type]

  //if (store?.chatbot?.config?.includeSender)
  message = message + `👤 ${staffName || ''}`
  const phone = defaultPhone || chooseOrderPhone(order)

  return await sendMessage({
    phone,
    message,
    apiKey: store.chatbot?.apiKey,
    botId: store.chatbot?.id
  })
    .then((res) => {
      if (res?.data?.existsOnWhats === false) {
        return { success: false, error: 'no existe en whatsapp' }
      }
      if (res?.data?.waited) {
        const sentMessage: SentMessage = {
          message,
          sentAt: new Date(),
          number: phone,
          sentBy: userId
        }
        ServiceOrders.update(order.id, {
          //@ts-ignore
          sentMessages: arrayUnion(sentMessage)
        })
        return { success: true }
      }
      return { success: false, error: 'no enviado' }
    })
    .catch((e) => {
      console.error(e)
      return { success: false, error: 'no enviado' }
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
  if (!chatbot?.enabled) {
    return {
      message: 'chatbot is not enabled',
      isValid: false
    }
  }
  if (!chatbot?.apiKey) {
    return {
      message: 'chatbot api key is missing',
      isValid: false
    }
  }
  if (!chatbot?.id) {
    return {
      message: 'chatbot id is missing',
      isValid: false
    }
  }
  if (messageType === 'expire') {
    return {
      message: 'expire message is enabled',
      isValid: true
    }
  }

  if (messageType === 'status') {
    return {
      message: 'status message is enabled',
      isValid: true
    }
  }
  return {
    message: `sending ${messageType}`,
    isValid: true
  }

  if (!chatbot?.config) {
    return {
      message: 'chatbot config is missing',
      isValid: false
    }
  }

  if (chatbot?.config?.sendDelivered && messageType === 'delivery') {
    return {
      message: 'delivery message is enabled',
      isValid: true
    }
  }
  if (chatbot?.config?.sendPickedUp && messageType === 'pickup') {
    return {
      message: 'pickup message is enabled',
      isValid: true
    }
  }
  if (chatbot?.config?.sendRenewed && messageType === 'renew') {
    return {
      message: 'renew message is enabled',
      isValid: true
    }
  }

  return {
    message: `message type ${messageType} is not enabled`,
    isValid: false
  }
}

export default sendOrderMessage
