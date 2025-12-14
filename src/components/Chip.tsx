import type { ViewStyle } from 'react-native'
import { type ChipProps, Chip as RNEChip } from 'react-native-elements'
import Icon2 from '../icons'
import type { IconName } from './Icon'

export type Size = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Calculate the luminance of a color to determine if it's light or dark
 * Uses WCAG 2.0 formula for better contrast calculation
 * Returns a color (black or white) with good contrast
 */
const getContrastColor = (hexColor: string): string => {
	if (!hexColor) return '#000000'

	// Handle special color keywords
	if (hexColor.toLowerCase() === 'transparent') return '#000000'
	if (hexColor.toLowerCase() === 'white') return '#000000'
	if (hexColor.toLowerCase() === 'black') return '#FFFFFF'

	// Remove # if present and normalize
	let hex = hexColor.replace('#', '').trim()

	// Handle 3-digit hex codes
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map(char => char + char)
			.join('')
	}

	// If not a valid hex, return black without warning
	if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
		return '#000000'
	}

	// Convert to RGB
	let r = Number.parseInt(hex.substring(0, 2), 16) / 255
	let g = Number.parseInt(hex.substring(2, 4), 16) / 255
	let b = Number.parseInt(hex.substring(4, 6), 16) / 255

	// Apply gamma correction
	r = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4
	g = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4
	b = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4

	// Calculate relative luminance using WCAG formula
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

	// Return black for light backgrounds (luminance > 0.6), white for dark
	// Higher threshold ensures better readability on colored backgrounds
	return luminance > 0.6 ? '#000000' : '#FFFFFF'
}

const Chip = ({
	title = '',
	color,
	titleColor,
	size = 'md',
	style,
	onPress,
	maxWidth,
	icon,
	iconColor,
	iconSize,
	...props
}: Omit<ChipProps, 'icon'> & {
	title?: string
	color: string
	titleColor?: string
	size?: Size
	style?: ViewStyle
	icon?: IconName
	iconColor?: string
	maxWidth?: ViewStyle['maxWidth']
	iconSize?: 'xs' | 'sm' | 'md' | 'lg'
	onPress?: () => void
}) => {
	const sizes = {
		xs: {
			fontSize: 10,
			padding: 3
		},
		sm: {
			fontSize: 10,
			padding: 5
		},
		md: {
			fontSize: 12,
			padding: 8
		},
		lg: {
			fontSize: 14,
			padding: 10
		}
	}

	const iconSizes = {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 20
	}

	const autoContrastColor = getContrastColor(color)
	const finalTitleColor = titleColor || autoContrastColor
	const finalIconColor = iconColor || autoContrastColor

	return (
		<RNEChip
			title={title?.toUpperCase()}
			buttonStyle={[
				{
					padding: sizes[size].padding,
					backgroundColor: color,
					// Ensure proper dimensions when only showing icon
					minWidth:
						icon && !title ? iconSizes[iconSize || size] + sizes[size].padding * 2 : undefined,
					minHeight:
						icon && !title ? iconSizes[iconSize || size] + sizes[size].padding * 2 : undefined
				},
				style
			]}
			titleProps={{
				numberOfLines: 1
			}}
			titleStyle={{
				color: finalTitleColor,
				fontSize: sizes[size].fontSize,
				fontWeight: 'bold',
				maxWidth
			}}
			icon={
				icon ? (
					<Icon2 name={icon} color={finalIconColor} size={iconSizes[iconSize || size]} />
				) : undefined
			}
			iconRight={false}
			onPress={onPress}
			{...props}
		/>
	)
}

export default Chip
