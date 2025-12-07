import { Text } from 'react-native'
import React from 'react'
import { useStore } from '../contexts/storeContext'

const SpanStoreSection = ({ sectionId }: { sectionId?: string }) => {
	const { sections: storeSections } = useStore()
	const sectionName = storeSections?.find(s => s?.id === sectionId)?.name
	return <Text numberOfLines={1}>{sectionName}</Text>
}

export default SpanStoreSection
