import formatMxWhatsappPhone from './formatMxWhatsapPhone'
import axios from 'axios'
const sendMessage = async ({ phone, message = 'hola', botId, apiKey }) => {
  const endpoint = `https://www.builderbot.cloud/api/v2/${botId}/messages`
  if (!phone) return console.log('Phone number is required')
  if (!botId) return console.log('Bot Id is required')
  if (!apiKey) return console.log('Api Key is required')
  if (phone.length < 10) return console.log('Length phone number is invalid')
  const number = formatMxWhatsappPhone(phone)

  const data = {
    messages: {
      content: message
    },
    number: number
  }
  axios({
    method: 'post',
    url: endpoint,
    headers: {
      'Content-Type': 'application/json',
      'x-api-builderbot': apiKey
    },
    data,
    withCredentials: true
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error))
}

export default sendMessage
