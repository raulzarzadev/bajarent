import type { Timestamp } from 'firebase/firestore'

import { Text, View } from 'react-native'
import { dateFormat, fromNow } from '../libs/utils-date'
import { gStyles } from '../styles'
import SpanUser from './SpanUser'

const SpanMetadata = ({
	createdAt,
	createdBy,
	id,
	hidden,
	orderId,
	layout = 'row'
}: {
	createdAt: Date | Timestamp
	createdBy: string
	id?: string
	hidden?: boolean
	orderId?: string
	layout?: 'row' | 'column'
}) => {
	if (hidden) return null
	return (
		<View
			style={{
				flexDirection: layout,
				justifyContent: 'space-evenly',
				alignItems: 'center',
				flexWrap: 'wrap',
				width: '100%',
				marginBottom: 8
			}}
		>
			<Text style={gStyles.helper}>
				{` ${dateFormat(createdAt, 'dd/MMM/yy HH:mm')} ${fromNow(createdAt)} `}
			</Text>

			<Text style={[gStyles.helper, { textAlign: 'center' }]}>
				<SpanUser userId={createdBy} />
			</Text>
			<View>
				{id && <Text style={gStyles.helper}>id:{id}</Text>}
				{orderId && <Text style={gStyles.helper}> oId:{orderId}</Text>}
			</View>
		</View>
	)
}

export default SpanMetadata
