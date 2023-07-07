import { HttpStatus } from '@nestjs/common'
import { ExceptionManager } from './ExceptionManager'

export class BaseException extends Error {
  codigo: number = HttpStatus.INTERNAL_SERVER_ERROR
  mensaje: string
  errores: (string | object)[]
  errorStack: string
  traceStack: string
  causa: string
  origen: string
  modulo: string
  accion: string

  constructor(
    error: any,
    opt?: {
      mensaje?: string
      causa?: string
      origen?: string
      modulo?: string
      accion?: string
    }
  ) {
    super()

    // ERROR NORMALIZADO
    if (error instanceof BaseException) {
      this.codigo = error.codigo
      this.mensaje = error.mensaje
      this.errores = error.errores
      this.errorStack = error.errorStack
      this.traceStack = error.traceStack
      this.causa = error.causa
      this.origen = error.origen
      this.modulo = error.modulo
      this.accion = error.accion
      this.message = error.mensaje
    }

    // OTRO TIPO DE ERROR
    else {
      const errorInfo = ExceptionManager.handleError(error, opt)
      this.codigo = errorInfo.codigo
      this.mensaje = errorInfo.mensaje
      this.errores = errorInfo.errores
      this.errorStack = errorInfo.errorStack
      this.traceStack = errorInfo.traceStack
      this.causa = errorInfo.causa
      this.origen = errorInfo.origen
      this.modulo = errorInfo.modulo
      this.accion = errorInfo.accion
      this.message = errorInfo.mensaje
    }
  }
}
