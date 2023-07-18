import { ExceptionManager } from './ExceptionManager'
import { ErrorInfo } from './ErrorInfo'
import { ErrorOptions } from '../types'

export class BaseException extends Error {
  errorInfo: ErrorInfo

  constructor(opt: ErrorOptions) {
    const errorInfo = ExceptionManager.handleError(opt)
    const message = errorInfo.obtenerMensajeCliente()
    super(message)
    this.errorInfo = errorInfo
  }
}
