import { Dispatch, SetStateAction, useContext } from 'react'
import { Theme, dark, light } from '../theme'
import { ThemeContext } from '../contexts/themeContext'

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
