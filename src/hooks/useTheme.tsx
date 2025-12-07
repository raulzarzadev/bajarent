import { type Dispatch, type SetStateAction, useContext } from 'react'
import { ThemeContext } from '../contexts/themeContext'
import { dark, light, type Theme } from '../theme'

interface UseThemeHook {
	theme: Theme
	setTheme: Dispatch<SetStateAction<'light' | 'dark'>>
}

const useTheme = (): UseThemeHook => {
	const { theme, setTheme } = useContext(ThemeContext)!

	if (theme === 'dark') {
		return {
			theme: dark,
			setTheme
		}
	}

	return {
		theme: light,
		setTheme
	}
}

export default useTheme
