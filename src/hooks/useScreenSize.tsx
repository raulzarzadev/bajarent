import { Dimensions } from 'react-native'
function useScreenSize() {
	const width = Dimensions.get('window').width
	return {
		isMobile: width < 768,
		isTablet: width >= 768 && width < 1024,
		isDesktop: width >= 1024
	}
}

export default useScreenSize
