import { LoggerService } from '../../core/logger'
import { BaseException } from '../../common/exception-manager'
import { ErrorParams } from '../exception-manager/types'

export class ExternalServiceException extends BaseException {
  constructor(mensaje: string)
  constructor(mensaje: string, error: unknown)
  constructor(mensaje: string, error: unknown, detalle: unknown[])
  constructor(opt: ErrorParams)
  constructor(arg1: string | ErrorParams, arg2?: unknown, arg3?: unknown[]) {
    super(LoggerService.handleError(arg1, arg2, arg3))
  }
}
