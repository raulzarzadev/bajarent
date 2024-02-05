import { Component, ReactNode } from 'react'
import { ServiceAppErrors } from '../firebase/ServiceAppErrors'

interface Props {
  fallback?: ReactNode
  children?: ReactNode
  componentName?: string
}

type State = {
  hasError: boolean
  error: any
  info: any
}

export type AppError = {
  code: string
  message: string
  componentName?: string
  error: any
  info: any
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ error, info })
  }

  logErrorToMyService = async () => {
    const { error } = this.state
    const { componentName } = this.props
    const newError = {
      code: 'ERROR_BOUNDARY',
      message: error.message,
      componentName
    }
    console.log('error sent', { newError })
    await ServiceAppErrors.create({
      ...newError
      // error,
      // info
    })
      .then(console.log)
      .catch(console.error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              width: '100% ',
              justifyContent: 'space-around',
              textAlign: 'center',
              height: '100vh',
              border: '5px solid red',
              display: 'flex',
              flexDirection: 'column',
              placeContent: 'center'
            }}
          >
            <p>¡Ups! Hubo un problema.</p>
            <div>
              <button
                style={{ margin: 4, width: 100 }}
                onClick={() => window.location.replace('/')}
              >
                Recargar
              </button>
              <button
                style={{ margin: 4, width: 100 }}
                onClick={async () => {
                  await this.logErrorToMyService()

                  window.location.reload()
                }}
              >
                Enviar error
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children || <>No component</>
  }
}

export default ErrorBoundary
