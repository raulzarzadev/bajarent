import formatMxWhatsappPhone from './formatMxWhatsapPhone'

const sendMessage = async ({ phone, message = 'hola' }) => {
  const endpoint = process.env.BUILDERBOT_API_ENDPOINT
  const apiKey = process.env.BUILDERBOT_API_KEY
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
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-builderbot': apiKey
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export default sendMessage
