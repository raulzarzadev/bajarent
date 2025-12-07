import { View } from 'react-native'
import TextInfo from './TextInfo'

const TextInfos = () => {
	return (
		<View>
			<TextInfo
				text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam."
				type="error"
			/>
			<TextInfo
				text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam. adipisicing elit. Quasi"
				type="info"
			/>
			<TextInfo
				text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quisquam."
				type="success"
			/>
			<TextInfo text="Lorem ipsum dolor sit amet consectetur View" type="warning" />
		</View>
	)
}

export default TextInfos
