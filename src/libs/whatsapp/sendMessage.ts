import axios from 'axios'

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

  const endpoint = __DEV__
    ? 'http://localhost:3000/api/messages'
    : 'https://bajarent.app/api/messages'

  return axios.post(endpoint, data)
  // .then((response) => console.log(response))
  // .catch((error) => console.error(error))
}

export default sendMessage
