import React, { createContext, useState, useContext, ReactNode } from 'react'

interface CurrentWorkContextProps {
  currentWork: string
  setCurrentWork: (work: string) => void
}

const CurrentWorkContext = createContext<CurrentWorkContextProps | undefined>(
  undefined
)

export const CurrentWorkProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [currentWork, setCurrentWork] = useState<string>({})

  return (
    <CurrentWorkContext.Provider value={{ currentWork, setCurrentWork }}>
      {children}
    </CurrentWorkContext.Provider>
  )
}

export const useCurrentWork = (): CurrentWorkContextProps => {
  const context = useContext(CurrentWorkContext)
  if (!context) {
    throw new Error('useCurrentWork must be used within a CurrentWorkProvider')
  }
  return context
}
