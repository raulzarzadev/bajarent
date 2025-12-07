import { View, Text } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import { gStyles } from '../styles'
import StoreType, { bot_configs, bot_configs_order_flow } from '../types/StoreType'
import { useStore } from '../contexts/storeContext'
import { messageOptions } from '../libs/whatsapp/sendOrderMessage'
import OrderType, { order_type } from '../types/OrderType'
import { Payment } from '../libs/paymentsUtils'
import { FormChatbotE } from './FormChatbot'
import { ServiceStores } from '../firebase/ServiceStore'
import theme from '../theme'
import Button from './Button'
import StyledModal from './StyledModal'
import useModal from '../hooks/useModal'
import InputTextStyled from './InputTextStyled'
import { useState } from 'react'
import sendMessage, { WSSender } from '../libs/whatsapp/sendMessage'
import Tabs from './Tabs'
import FormikCheckbox from './FormikCheckbox'
import dictionary from '../dictionary'
import { Formik } from 'formik'
import FormChatbotAutoWs from './FormChatbotAutoWs'
const ScreenChatbot = (props?: ScreenChatbotProps) => {
	const { store } = useStore()
	const handleUpdateChatbot = async (values: { chatbot: any }) => {
		return await ServiceStores.update(store.id, { chatbot: values.chatbot })
	}

	return (
		<View>
			<Tabs
				defaultTab="BuilderBot"
				tabId="chatbot-tabs"
				tabs={[
					{
						title: 'BuilderBot',
						show: true,
						content: (
							<>
								<FormChatbotE
									values={store.chatbot}
									onSubmit={chatbot => handleUpdateChatbot({ chatbot })}
								/>
							</>
						)
					},
					{
						title: 'Auto-ws',
						content: (
							<>
								<Text>Este sender no esta configurado aún</Text>
								{/* <RandomMessage sender="auto-ws" />
                <FormChatbotAutoWs
                  values={store.chatbot}
                  onSubmit={(chatbot) => handleUpdateChatbot({ chatbot })}
                /> */}
							</>
						),

						show: false
					},
					{
						title: 'Mensajes',
						content: (
							<>
								<View>
									<View style={{ marginVertical: 4 }}>
										<RandomMessage sender="builderbot" />
									</View>
									<Text style={gStyles.h2}>Configuración de mensajes</Text>
									<Text style={[gStyles.tCenter]}>
										* Se enviaran los mensajes que esten marcados. Algunos corresponden al flujo de
										las ordenes y otros al contenido.
									</Text>

									<Formik
										initialValues={store.chatbot || {}}
										onSubmit={values => {
											handleUpdateChatbot({ chatbot: values })
										}}
									>
										{({ values, handleSubmit, isSubmitting }) => (
											<View
												style={{
													padding: 4,
													backgroundColor: theme.white,
													borderRadius: 8
												}}
											>
												<Text style={gStyles.h3}>Chatbot</Text>
												{/* <FormikCheckbox
                          name="enabled"
                          label="Activar chatbot"
                        ></FormikCheckbox> */}

												<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
													{Object.entries(bot_configs).map(([key, value]) => (
														<FormikCheckbox
															key={key}
															name={`config.${key}`}
															label={dictionary(key)}
														></FormikCheckbox>
													))}
												</View>
												<View
													style={{
														flexDirection: 'row',
														justifyContent: 'center',
														marginVertical: 16
													}}
												>
													<Button
														size="xs"
														label="Actualizar"
														onPress={handleSubmit}
														disabled={isSubmitting}
													></Button>
												</View>
											</View>
										)}
									</Formik>
								</View>
								<SampleMessages store={store} />
							</>
						),

						show: store.chatbot?.enabled === true
					}
				]}
			></Tabs>
			{/*  */}
		</View>
	)
}
export const SampleMessages = ({ store }: { store: StoreType }) => {
	return (
		<View>
			<Text style={gStyles.h2}>Mensajes de muestra</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{Object.entries(bot_configs_order_flow).map(([key, value]) => (
					<View
						key={key}
						style={{
							width: 200,
							marginHorizontal: 'auto',
							padding: 4,
							margin: 4,
							borderRadius: 8,
							backgroundColor: theme.white
						}}
					>
						<Text style={gStyles.h3}>
							{store?.chatbot?.config?.[key] ? '✅' : '❌'}
							{value}
						</Text>
						<Text>
							{
								messageOptions({
									order: mockOrder,
									lastPayment: mockPayment,
									store
								})[key]
							}
						</Text>
					</View>
				))}
			</View>
		</View>
	)
}
export const ChatbotStatus = ({ chatbot }) => {
	return (
		<>
			{!chatbot?.enabled && <Text>El chatbot esta desactivado</Text>}
			{chatbot?.enabled && (
				<View>
					<View>
						<Text style={[gStyles.h3, { marginTop: 8 }]}>Chatbot</Text>
						<Text style={gStyles.tCenter}>Status: {chatbot?.enabled ? '✅' : '❌'}</Text>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
							{Object.entries(bot_configs).map(([key, value]) => (
								<View key={key}>
									<Text style={[gStyles.tCenter, { marginRight: 4 }]}>
										<Text style={gStyles.tBold}>{chatbot?.config?.[key] ? '✅' : '❌'}</Text>
										{value}{' '}
									</Text>
								</View>
							))}
						</View>
					</View>
				</View>
			)}
		</>
	)
}
const mockOrder: Partial<OrderType> = {
	fullName: 'John Doe',
	customerName: 'John Doe',
	folio: 123,
	type: order_type.RENT,
	expireAt: new Date(),
	deliveredAt: new Date(),

	items: [
		{
			brand: 'Maytag',
			number: '00023'
		}
	]
}
const mockPayment: Partial<Payment> = {
	amount: 100,
	method: 'cash'
}
export default ScreenChatbot
export type ScreenChatbotProps = {}
export const ScreenChatbotE = (props: ScreenChatbotProps) => (
	<ErrorBoundary componentName="ScreenChatbot">
		<ScreenChatbot {...props} />
	</ErrorBoundary>
)

export const RandomMessage = ({ sender }: { sender: WSSender }) => {
	const modal = useModal({ title: 'Enviar mensaje de prueba' })
	const { store } = useStore()
	const [message, setMessage] = useState('')
	const [number, setNumber] = useState('+52')
	const [disabled, setDisabled] = useState(false)
	const [response, setResponse] = useState('')
	const responses = {
		NOT_DEPLOYED: 'El chatbot no esta activado',
		WAITED: 'Mensaje enviado correctamente'
	}

	const handleSendMessage = () => {
		setDisabled(true)
		// console.log('send message', message, number)
		let configDependOfSender = {
			phone: number,
			message,
			apiKey: store.chatbot.apiKey,
			botId: store.chatbot.id
		}

		if (sender === 'auto-ws') {
			configDependOfSender.apiKey = store.chatbot?.autoWsApiKey
			configDependOfSender.botId = store.chatbot?.autoWsId
		}

		sendMessage({ ...configDependOfSender, sender })
			.then(res => {
				console.log({ res })
				if (!res) return
				if (!res.data) return
				if (res.data.error === 'Deploy not found') {
					setResponse(responses.NOT_DEPLOYED)
				}
				if (res.data.error) {
					setResponse(res.data.error)
				}
				if (res.data.waited) {
					setResponse(responses.WAITED)
				}
			})
			.catch(err => {
				console.log('err', err)
				setResponse(err.message || 'Error desconocido')
			})
			.finally(() => {
				setTimeout(() => {
					setResponse('')
					setDisabled(false)
				}, 3000)
			})
	}
	return (
		<>
			<Button
				label="Mensaje personalizado (pruebas)"
				size="xs"
				buttonStyles={{ marginHorizontal: 'auto', marginVertical: 8 }}
				onPress={modal.toggleOpen}
			></Button>
			<StyledModal {...modal}>
				<InputTextStyled
					value={message}
					onChangeText={setMessage}
					placeholder="Mensaje"
				></InputTextStyled>
				<InputTextStyled
					value={number}
					onChangeText={setNumber}
					placeholder="Número (con código de país)"
				></InputTextStyled>
				{!!response && <Text style={gStyles.helper}>*{response}</Text>}
				<Button onPress={handleSendMessage} disabled={disabled}>
					Enviar
				</Button>
			</StyledModal>
		</>
	)
}
