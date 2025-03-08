import { Text, View } from 'react-native'
import P from './P'
import StoreType, { bot_configs } from '../types/StoreType'
import { gStyles } from '../styles'
import Button from './Button'
import { useEmployee } from '../contexts/employeeContext'
import BadgesStore from './BadgesStore'
import ErrorBoundary from './ErrorBoundary'
import { useNavigation } from '@react-navigation/native'
import SpanCopy from './SpanCopy'
import LinkLocation from './LinkLocation'
import { Separator } from './Separator'
import { ChatbotStatus } from './ScreenChatbot'

const StoreDetails = ({ store }: { store: StoreType }) => {
  const { navigate } = useNavigation()
  const {
    permissions: { isAdmin, isOwner }
  } = useEmployee()

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={gStyles.h1}>{store?.name}</Text>

        {(isAdmin || isOwner) && (
          <Button
            color="secondary"
            variant="ghost"
            justIcon
            icon="settings"
            onPress={() => {
              //@ts-ignore
              navigate('EditStore')
            }}
            id="editStore"
          />
        )}
      </View>
      <BadgesStore />
      <SpanCopy
        label={'Copiar información'}
        copyValue={`\nTienda: *${store?.name || ''}* ${
          store?.address ? `Direccón:\n${store?.address}\n` : ''
        } ${store?.description ? `Descripción:\n${store?.description}\n` : ''}
        ${arrayRows({ rows: store?.contacts, title: 'Contactos' })}
        ${arrayRows({ rows: store?.socialMedia, title: 'Redes sociales' })}
        ${arrayRows({ rows: store?.bankAccounts, title: 'Cuentas de banco' })}`}
      />
      <P>{store?.description}</P>
      <Text style={gStyles.h3}>Dirección</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={[gStyles.p, gStyles.tCenter]}>{store?.address} </Text>

        {store?.location && <LinkLocation location={store?.location} />}
      </View>
      <Separator />
      <Text style={gStyles.h2}>Contactos</Text>
      {store?.contacts?.map(({ label, value, type }, index) => (
        <RowInfo key={index} label={label} value={value} type={type} />
      ))}
      <Separator />
      <Text style={gStyles.h2}>Redes sociales</Text>
      {store?.socialMedia?.map(({ label, value, type }, index) => (
        <RowInfo key={index} label={label} value={value} type={type} />
      ))}
      <Separator />
      <Text style={gStyles.h2}>Cuentas de banco</Text>
      {store?.bankAccounts?.map(({ label, value, type }, index) => (
        <RowInfo key={index} label={label} value={value} type={type} />
      ))}
      <ChatbotStatus chatbot={store?.chatbot} />
    </View>
  )
}

const arrayRows = ({ rows = [], title }: { rows: RowInfo[]; title: string }) =>
  `${
    rows?.length > 0
      ? `\n${title}\n${rows?.map((row) => stringRow({ row })).join('\n') || ''}`
      : ''
  }`

type RowInfo = { label: string; value: string; type: string }

const stringRow = ({ row }: { row: RowInfo }) => {
  const { label, value, type } = row
  return `${type || ''}${label || ''} ${value || ''} `
}

const RowInfo = ({ label, value, type }) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 4
      }}
    >
      <Text style={{ marginHorizontal: 4 }}>{type || ''}</Text>
      <Text style={{ marginHorizontal: 4 }}>{label || ''}</Text>
      <Text style={{ marginHorizontal: 4 }}>{value || ''}</Text>
    </View>
  )
}

export const StoreDetailsE = (props) => (
  <ErrorBoundary componentName="StoreDetails">
    <StoreDetails {...props} />
  </ErrorBoundary>
)

export default StoreDetails
