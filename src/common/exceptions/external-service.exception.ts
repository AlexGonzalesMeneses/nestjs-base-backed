import { BaseException, ErrorOptions } from '../../core/logger'

export class ExternalServiceException extends BaseException {
  constructor(opt: ErrorOptions)
  constructor(servicio: string, error: unknown)
  constructor(servicio: string, error: unknown, mensaje: string)
  constructor(
    servicio: string,
    error: unknown,
    mensaje: string,
    detalle: unknown
  )
  constructor(
    arg1: string | ErrorOptions,
    error?: unknown,
    mensaje?: string,
    detalle?: unknown
  ) {
    const opt =
      typeof arg1 === 'string'
        ? {
            modulo: arg1,
            error,
            mensaje,
            detalle,
          }
        : arg1
    super(opt)
  }
}
