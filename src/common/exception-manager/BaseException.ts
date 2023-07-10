import { ExceptionManager } from './ExceptionManager'
import { ErrorInfo } from './ErrorInfo'
import { HandleErrorOptions } from './types'

export class BaseException extends Error {
  errorInfo: ErrorInfo

  constructor(error: unknown, errorHandler: string, opt: HandleErrorOptions) {
    super()

    if (error instanceof BaseException) {
      this.errorInfo = error.errorInfo
      this.message = error.message
    }

    this.errorInfo = ExceptionManager.handleError(error, errorHandler, opt)
    this.message = this.errorInfo.obtenerMensajeCliente()
  }
}
