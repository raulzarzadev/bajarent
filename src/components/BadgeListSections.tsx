import { View } from 'react-native'
import ErrorBoundary from './ErrorBoundary'
import Chip from './Chip'
import theme from '../theme'

export const BadgeListSections = ({
	sections = [],
	selectedSection,
	onPressSection
}: BadgeListSectionsProps) => {
	const sortedSections = sections?.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { numeric: true })
	)
	return (
		<View
			style={{
				flexDirection: 'row',
				flexWrap: 'wrap',
				justifyContent: 'center'
			}}
		>
			{sortedSections?.map(section => (
				<Chip
					style={{
						margin: 4,
						borderWidth: 2,
						borderColor:
							selectedSection && selectedSection === section.id ? theme.primary : theme.transparent
					}}
					size="sm"
					title={section?.name}
					color={theme.white}
					titleColor={theme.secondary}
					key={section.id}
					onPress={() => onPressSection?.({ sectionId: section.id })}
				></Chip>
			))}
		</View>
	)
}

export type BadgeListSectionsProps = {
	sections: { id: string; name: string }[]
	selectedSection?: string | null
	onPressSection?: ({ sectionId }: { sectionId: string }) => void
}
export const BadgeListSectionsE = (props: BadgeListSectionsProps) => (
	<ErrorBoundary componentName="BadgeListSections">
		<BadgeListSections {...props} />
	</ErrorBoundary>
)
