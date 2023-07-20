import { BaseException } from '../../core/logger'

export class ExternalServiceException extends BaseException {
  constructor(servicio: string, error: unknown)
  constructor(servicio: string, error: unknown, mensaje: string)
  constructor(
    servicio: string,
    error: unknown,
    mensaje: string,
    detalle: unknown
  )
  constructor(
    arg1: string,
    error?: unknown,
    mensaje?: string,
    detalle?: unknown
  ) {
    const opt = {
      modulo: arg1,
      mensaje,
      detalle,
    }
    super(error, opt)
  }
}
