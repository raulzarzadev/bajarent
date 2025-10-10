import { useStore } from '../contexts/storeContext'
import { RandomMessage, SampleMessages } from './ScreenChatbot'
import { FormChatbotE } from './FormChatbot'
import { ServiceStores } from '../firebase/ServiceStore'

export const AutoWSConfig = () => {
  const { store } = useStore()
  const handleUpdateChatbot = async (values: { chatbot: any }) => {
    return await ServiceStores.update(store.id, { chatbot: values.chatbot })
  }
  console.log(store.chatbot)
  return (
    <>
      <RandomMessage sender="builderbot" />
      <FormChatbotE
        values={store.chatbot}
        onSubmit={(chatbot) => handleUpdateChatbot({ chatbot })}
      />
    </>
  )
}
