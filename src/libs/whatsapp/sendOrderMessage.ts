import { arrayUnion } from 'firebase/firestore'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import sendMessage from './sendMessage'
import OrderType, { SentMessage } from '../../types/OrderType'
import StoreType, { bot_configs_order_flow } from '../../types/StoreType'
import {
  authorizedOrder,
  expiredMessage,
  newStoreOrder,
  newWebOrder,
  orderStatus,
  rentFinished,
  rentRenewed,
  rentStarted
} from '../whatsappMessages'
import chooseOrderPhone from './chooseOrderPhone'
import PaymentType from '../../types/PaymentType'
import { CustomerType } from '../../state/features/costumers/customerType'
import { getFavoriteCustomerPhone } from '../../components/Customers/lib/lib'

export type OrderFlowMessages = keyof typeof bot_configs_order_flow

export const onSendOrderWhatsapp = async ({
  store,
  order,
  phone: defaultPhone,
  type,
  userId,
  lastPayment,
  customer
}: {
  store: StoreType
  phone?: string
  order: Partial<OrderType>
  customer?: CustomerType
  type: OrderFlowMessages
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

  // Create a new order object with fullName instead of mutating
  const orderWithCustomerName = {
    ...order,
    fullName: customer?.name || order?.fullName || ''
  }

  const staffName = store?.staff?.find((s) => s.userId === userId)?.position
  let message = messageOptions({
    order: orderWithCustomerName,
    store,
    lastPayment
  })[type]

  const customerPhone = getFavoriteCustomerPhone(customer?.contacts)

  if (store?.chatbot?.config?.includeSender && staffName)
    message = message + `👤 ${staffName || ''}`

  const phone =
    customerPhone || defaultPhone || chooseOrderPhone(orderWithCustomerName)

  const config = {
    phone,
    message,
    apiKey: store.chatbot?.apiKey,
    botId: store.chatbot?.id
  }
  if (process.env.PRE_PRODUCTION)
    console.log({
      phone: !!config.phone,
      message: !!config.message,
      apiKey: !!config.apiKey,
      botId: !!config.botId
    })
  return await sendMessage(config)
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
        ServiceOrders.update(orderWithCustomerName.id, {
          //@ts-ignore
          sentMessages: arrayUnion(sentMessage)
        })
        return { success: true }
      }
      return { success: false, error: 'no enviado' }
    })
    .catch((e) => {
      //console.error(e)
      return { success: false, error: 'no enviado' }
    })
}
export const messageOptions = ({ order, store, lastPayment }) => {
  return {
    sendAuthorizedOrder: authorizedOrder({
      order,
      store
    }),
    sendNewStoreOrder: newStoreOrder({
      order,
      storeName: store.name
    }),

    sendRenewed: rentRenewed({
      order,
      storeName: store.name,
      lastPayment: lastPayment || order?.payments?.[0] || null
    }),
    sendDelivered: rentStarted({
      order,
      storeName: store.name,
      lastPayment: lastPayment || order?.payments?.[0] || null
    }),
    sendPickedUp: rentFinished({
      order,
      storeName: store.name
    }),
    sendStatusOrder: orderStatus({
      order,
      storeName: store.name
    }),
    sendExpireOrder: expiredMessage({
      order,
      store
    }),
    sendNewWebOrder: newWebOrder({
      order,
      storeName: store.name
    })
  }
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
  messageType: OrderFlowMessages
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
  if (!chatbot?.config?.[messageType]) {
    return {
      message: `message type ${messageType} is not enabled`,
      isValid: false
    }
  }
  return {
    message: `sending ${messageType}`,
    isValid: true
  }
}
