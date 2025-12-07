import { useStore } from '../contexts/storeContext'
import { ServiceStores } from '../firebase/ServiceStore'
import { FormChatbotE } from './FormChatbot'
import { RandomMessage } from './ScreenChatbot'

export const AutoWSConfig = () => {
	const { store } = useStore()
	const handleUpdateChatbot = async (values: { chatbot: any }) => {
		return await ServiceStores.update(store.id, { chatbot: values.chatbot })
	}
	return (
		<>
			<RandomMessage sender="builderbot" />
			<FormChatbotE values={store.chatbot} onSubmit={chatbot => handleUpdateChatbot({ chatbot })} />
		</>
	)
}
