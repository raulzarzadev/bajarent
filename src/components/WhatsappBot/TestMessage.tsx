import { useState } from 'react'
import { Text, View } from 'react-native'
import { useStore } from '../../contexts/storeContext'
import sendMessage from '../../libs/whatsapp/sendMessage'
import ButtonConfirm from '../ButtonConfirm'
import InputPhone from '../InputPhone'

const TestMessage = () => {
	const [number, setNumber] = useState('')
	const { store } = useStore()

	return (
		<View
			style={{
				justifyContent: 'flex-end',
				width: 140,
				marginLeft: 'auto',
				marginVertical: 8
			}}
		>
			<ButtonConfirm
				openSize="xs"
				openLabel="Mensaje de prueba"
				openVariant="ghost"
				icon="comment"
				handleConfirm={async () => {
					const res = sendMessage({
						phone: number,
						message: 'Mensaje de prueba',
						apiKey: store?.chatbot?.apiKey,
						botId: store?.chatbot?.id
					})
					console.log({ testMessageResponse: res })
				}}
				confirmLabel="Enviar"
			>
				<View style={{ marginVertical: 8 }}>
					<InputPhone onChange={number => setNumber(number)} />
				</View>
			</ButtonConfirm>
		</View>
	)
}
export default TestMessage
