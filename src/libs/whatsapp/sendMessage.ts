import axios from 'axios'
import { Platform } from 'react-native'

const sendMessage = async ({
  phone,
  message = 'hola',
  botId,
  apiKey
}): Promise<{ data: { existsOnWhats?: boolean; waited?: boolean } }> => {
  const data = {
    message: message
      //* This is a workaround to fix the line break issue on web
      //  .replace(/\n/g, getOperatingSystem() === 'mac' ? '\r' : '\n'),
      .replace(/\n/g, '\r'),

    phone,
    botId,
    apiKey
  }

  return axios.post('http://localhost:3000/api/messages', data)
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
