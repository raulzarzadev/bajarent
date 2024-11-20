import formatMxWhatsappPhone from './formatMxWhatsapPhone'
import axios from 'axios'
const sendMessage = async ({ phone, message = 'hola', botId, apiKey }) => {
  const endpoint = `https://www.builderbot.cloud/api/v2/${botId}/messages`
  const number = formatMxWhatsappPhone(phone)

  const data = {
    messages: {
      content: message
    },
    number
  }
  axios({
    method: 'post',
    url: endpoint,
    headers: {
      'Content-Type': 'application/json',
      'x-api-builderbot': apiKey
    },
    data
  })
    .then((response) => console.log(response))
    .catch((error) => console.error('Error:', error))
}

export default sendMessage
