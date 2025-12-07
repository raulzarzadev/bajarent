import axios from 'axios'
import formatMxWhatsappPhone from './formatMxWhatsapPhone'

export const BOT_SENDERS = ['builderbot', 'auto-ws'] as const
export type WSSender = (typeof BOT_SENDERS)[number]

const sendMessage = async ({
	phone,
	message = 'hola',
	botId,
	apiKey,
	sender = 'builderbot'
}): Promise<{
	data: {
		existsOnWhats?: boolean
		waited?: boolean
		error?: string
		sender?: WSSender
	}
}> => {
	if (sender === 'builderbot') {
		const endpoint = `https://app.builderbot.cloud/api/v2/${botId}/messages`
		const number = formatMxWhatsappPhone(phone)
		const mediaUrl = undefined
		return fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-builderbot': apiKey || ''
			},
			body: JSON.stringify({
				number,
				checkIfExists: true,
				messages: {
					content: message,
					mediaUrl
				}
			})
		})
			.then(async res => {
				const data = await res.json()
				return { data }
			})
			.catch(err => {
				console.log('err', err)
				throw new Error(err?.response?.data?.message || 'Error desconocido')
			})
	}

	if (sender === 'auto-ws') {
		const data = {
			to: phone,
			content: {
				text: message
			}
		}

		const endpoint = `https://auto-ws.vercel.app/api/instances/${botId}/messages`

		return axios.post(endpoint, data, {
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey || ''
			}
		})
	}
}

export default sendMessage
