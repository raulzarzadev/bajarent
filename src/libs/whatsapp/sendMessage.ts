import formatMxWhatsappPhone from './formatMxWhatsapPhone'

const sendMessage = async ({ phone, message = 'hola', botId, apiKey }) => {
  const endpoint = `https://www.builderbot.cloud/api/v2/${botId}/messages`
  const number = formatMxWhatsappPhone(phone)

  const data = {
    messages: {
      content: message
    },
    number
  }
  console.log({
    endpoint,
    number,
    apiKey,
    message
  })
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-builderbot': apiKey
    },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((response) => console.log(response))
    .catch((error) => console.error('Error:', error))
}

export default sendMessage
