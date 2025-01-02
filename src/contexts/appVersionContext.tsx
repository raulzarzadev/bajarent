import { createContext, useContext, useEffect, useState } from 'react'
import { ServiceInternalConfig } from '../firebase/ServiceInternalConfig'

export type AppVersionContextType = {
  version: undefined | null | string
}
export const AppVersionContext = createContext<AppVersionContextType>(undefined)
export const AppVersionProvider = ({ children }) => {
  const [version, setVersion] = useState(undefined)

  useEffect(() => {
    ServiceInternalConfig.getVersion()
      .then((version) => {
        setVersion(version)
      })
      .catch((error) => {
        setVersion(null)
        console.error('AppVersionProvider', error)
      })
  }, [])

  return (
    <AppVersionContext.Provider value={{ version }}>
      {children}
    </AppVersionContext.Provider>
  )
}

export const useAppVersionContext = () => {
  return useContext(AppVersionContext)
}
