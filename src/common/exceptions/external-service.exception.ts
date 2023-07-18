import { BaseException } from '../../common/exception-manager'
import { ErrorParams } from '../exception-manager/types'

export class ExternalServiceException extends BaseException {
  constructor(servicio: string)
  constructor(servicio: string, error: unknown)
  constructor(servicio: string, error: unknown, mensaje: string)
  constructor(servicio: string, opt: ErrorParams)
  constructor(arg1: string, arg2?: unknown | ErrorParams, arg3?: string) {
    super({
      modulo: arg1,
      error: arg2,
      mensaje: arg3,
    })
  }
}
