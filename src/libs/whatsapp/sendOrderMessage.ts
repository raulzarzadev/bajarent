import { arrayUnion } from 'firebase/firestore'
import { ServiceOrders } from '../../firebase/ServiceOrders'
import sendMessage from './sendMessage'
import { SentMessage } from '../../types/OrderType'

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
export default sendOrderMessage
