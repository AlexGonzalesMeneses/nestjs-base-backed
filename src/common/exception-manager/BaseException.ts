import { ExceptionManager } from './ExceptionManager'
import { ErrorInfo } from './ErrorInfo'
import { ErrorParams } from './types'

export class BaseException extends Error {
  errorInfo: ErrorInfo

  constructor(opt: ErrorParams) {
    const errorInfo = ExceptionManager.handleError(opt)
    const message = errorInfo.obtenerMensajeCliente()
    super(message)
    this.errorInfo = errorInfo
  }
}
