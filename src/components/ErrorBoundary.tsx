import { Component, ReactNode } from 'react'
import { ServiceAppErrors } from '../firebase/ServiceAppErrors'
import { NavigationProp } from '@react-navigation/native'
import { Platform } from 'react-native'
interface Props {
  fallback?: ReactNode
  children?: ReactNode
  componentName?: string
  navigation?: NavigationProp<any>
}

type State = {
  hasError: boolean
  error: any
  info: any
  componentName: string | null
  errorSent: boolean
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
    this.state = {
      hasError: false,
      error: null,
      info: null,
      componentName: null,
      errorSent: false
    }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ error, info, componentName: this.props.componentName })
  }

  logErrorToMyService = async () => {
    const { error } = this.state
    const { componentName } = this.props
    const userAgent = Platform.OS + ' ' + window?.navigator?.userAgent
    const newError = {
      code: 'ERROR_BOUNDARY',
      message: error.message || '',
      componentName: componentName || '',
      userAgent
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
              border: '2px solid red',
              display: 'flex',
              flexDirection: 'column',
              placeContent: 'center'
            }}
          >
            <p>¡Ups! Hubo un problema.</p>
            <p>{this?.state?.componentName}</p>
            {/* <p>{this?.state?.error?.message}</p> */}
            <div>
              {/* <button
                style={{ margin: 4, width: 100 }}
                onClick={() => this.props.navigation.goBack()}
              >
                Regresar
              </button> */}
              {this.state.errorSent ? (
                <p>Error enviado</p>
              ) : (
                <button
                  style={{ margin: 4, width: 100 }}
                  onClick={async () => {
                    this.setState({ errorSent: true })
                    this.logErrorToMyService().then((res) => {
                      console.log({ res })
                      // window.location.reload()
                    })
                  }}
                >
                  Enviar error
                </button>
              )}
            </div>
          </div>
        )
      )
    }

    return this.props.children || <>No component</>
  }
}

export default ErrorBoundary
