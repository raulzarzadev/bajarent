/**
 * Retrieves the description of the unshortened URL.
 *
 * @param {Object} param0 - The parameter object.
 * @param {string} param0.url - The URL to unshorten.
 * @returns {Promise<{
 *   unshortened_url: string, - The unshortened URL.
 *   shortened_url: string,
 *   success: boolean
 * }>} - A promise that resolves to an object containing the unshortened URL, the shortened URL, and a success flag.
 */
//const url = 'https://unshorten.me/api/v2/unshorten?url=https://bit.ly/3DKWm5t'
const headers = {
  Authorization: process.env.UNSHORTEN_URL_TOKEN
}

/**
 *
 * @param param0
 *
 */
const unShortUrl = ({
  url
}): Promise<{
  unshortened_url: string
  shortened_url: string
  success: boolean
  message?: string
}> => {
  return fetch(`https://unshorten.me/api/v2/unshorten?url=${url}`, {
    headers: headers
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        return {
          success: false,
          message: data.error,
          unshortened_url: '', // //* un_shorted_url as empty string
          shortened_url: url
        }
      }
      if (data?.detail) {
        return {
          success: false,
          message: data.detail || 'looks like to many requests',
          unshortened_url: '', // //* un_shorted_url as empty string
          shortened_url: url
        }
      }
      return {
        success: data.success,
        unshortened_url: data.unshortened_url, //* un_shorted_url
        shortened_url: url
      }
      // Handle the response data here
    })
    .catch((error) => {
      console.log({ error })
      return {
        success: false,
        unshortened_url: '', // //* un_shorted_url as empty string
        shortened_url: url
      }
    })
}

export default unShortUrl
