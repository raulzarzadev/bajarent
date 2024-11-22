import axios from 'axios'

const sendMessage = async ({ phone, message = 'hola', botId, apiKey }) => {
  if (!phone) return console.log('Phone number is required')
  if (!botId) return console.log('Bot Id is required')
  if (!apiKey) return console.log('Api Key is required')
  if (phone.length < 10) return console.log('Length phone number is invalid')

  const data = {
    message,
    phone,
    botId,
    apiKey
  }

  return axios
    .post('https://bajarent.app/api/messages', data)
    .then((response) => console.log(response))
    .catch((error) => console.error(error))
}

export default sendMessage
