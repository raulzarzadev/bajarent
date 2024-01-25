import { useColorScheme } from 'react-native'
import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from 'react'
import { getItem, setItem } from '../libs/storage'

export type ThemeOptions = 'light' | 'dark'

export interface ThemeContextInterface {
  theme: ThemeOptions
  setTheme: Dispatch<SetStateAction<ThemeOptions>>
}

export const ThemeContext = createContext<ThemeContextInterface | null>(null)

export const ThemeProvider: FC<{}> = ({
  children
}: {
  children: ReactNode
}) => {
  // default theme to the system
  const scheme = useColorScheme()
  const [theme, setTheme] = useState<ThemeOptions>('light')
  console.log(theme)
  // fetch locally cached theme
  useEffect(() => {
    const fetchTheme = async () => {
      const localTheme = await getItem('theme')
      return localTheme
    }

    fetchTheme().then((localTheme) => {
      if (localTheme === 'dark' || localTheme === 'light') {
        setTheme(localTheme)
      }
    })
  }, [])

  // set new theme to local storage
  useEffect(() => {
    setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
