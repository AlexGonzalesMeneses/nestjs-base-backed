import { ExceptionManager } from './ExceptionManager'
import { ErrorInfo } from './ErrorInfo'
import { ErrorParams } from './types'

export class BaseException extends Error {
  errorInfo: ErrorInfo

  constructor(opt: ErrorParams) {
    super()

    if (opt.error instanceof BaseException) {
      this.errorInfo = opt.error.errorInfo
      this.message = opt.error.message
    }

    this.errorInfo = ExceptionManager.handleError(opt)
    this.message = this.errorInfo.obtenerMensajeCliente()
  }
}
