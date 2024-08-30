//const url = 'https://unshorten.me/api/v2/unshorten?url=https://bit.ly/3DKWm5t'
const headers = {
  Authorization: process.env.UNSHORTEN_URL_TOKEN
}
const unShortUrl = ({
  url
}): Promise<{
  unshortened_url: string
  shortened_url: string
  success: boolean
}> => {
  console.log({ headers })
  return fetch(`https://unshorten.me/api/v2/unshorten?url=${url}`, {
    headers: headers
  })
    .then((response) => response.json())
    .then((data) => {
      return data
      // Handle the response data here
    })
    .catch((error) => {
      console.error(error)
      return {
        unshortened_url: url,
        shortened_url: url,
        success: false
      }
      // Handle any errors that occurred during the request
    })
}

export default unShortUrl
