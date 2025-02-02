import axios from 'axios'
import { Platform } from 'react-native'

const sendMessage = async ({ phone, message = 'hola', botId, apiKey }) => {
  if (!phone) return console.log('Phone number is required')
  if (!botId) return console.log('Bot Id is required')
  if (!apiKey) return console.log('Api Key is required')
  if (phone.length < 10) return console.log('Length phone number is invalid')

  const data = {
    message: message
      //* This is a workaround to fix the line break issue on web
      //  .replace(/\n/g, getOperatingSystem() === 'mac' ? '\r' : '\n'),
      .replace(/\n/g, '\r'),

    phone,
    botId,
    apiKey
  }

  return axios.post('https://bajarent.app/api/messages', data)
  // .then((response) => console.log(response))
  // .catch((error) => console.error(error))
}
const getOperatingSystem = () => {
  if (Platform.OS === 'web') {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('win')) {
      return 'win'
    } else if (userAgent.includes('mac')) {
      return 'mac'
    } else {
      return 'Other'
    }
  } else {
    return Platform.OS
  }
}
console.log('os:', getOperatingSystem())
export default sendMessage
