import {
  cleanParamValue,
  getErrorStack,
  isAxiosError,
  isCertExpiredError,
  isConexionError,
} from '../../core/logger'
import { HttpException, HttpStatus } from '@nestjs/common'
import { HandleErrorOptions } from './types'
import { extractMessage } from './utils'
import { ErrorInfo } from './ErrorInfo'
import { BaseException } from './BaseException'
import { HttpMessages } from './messages'

export class ExceptionManager {
  static handleError(
    error: unknown,
    errorHandler: string,
    opt: HandleErrorOptions = {}
  ): ErrorInfo {
    // si ya se procesó el error entonces devolvemos esta información
    if (error && error instanceof ErrorInfo) return error
    if (error && error instanceof BaseException) return error.errorInfo

    const errorStack = error instanceof Error ? getErrorStack(error) : ''
    const errorInfo = new ErrorInfo({
      codigo: opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR,
      mensaje: opt.mensaje || HttpMessages.EXCEPTION_INTERNAL_SERVER_ERROR,
      error: cleanParamValue(error),
      errorStack,
      detalle:
        opt.detalle ||
        cleanParamValue(error instanceof Error ? [error.toString()] : []),
      sistema: opt.sistema || '',
      causa: opt.causa || '',
      origen: opt.origen || errorStack.split('\n').shift() || '',
      accion: opt.accion || 'Más info en detalles',
      errorHandler: errorHandler,
      traceStack: getErrorStack(new Error()),
    })

    // TYPED ERROR
    if (!error || typeof error !== 'object') {
      errorInfo.codigo = opt.codigo || HttpStatus.BAD_REQUEST
      errorInfo.mensaje =
        opt.mensaje ||
        'Ocurrió un error inesperado, por favor verifique los datos de entrada e inténtelo nuevamente'
      errorInfo.causa =
        opt.causa || 'Posiblemente sea el formato de los datos de entrada'
      errorInfo.accion =
        opt.accion || 'Verifica el contenido del objeto JSON enviado en el body'
    }

    // CONEXION ERROR
    else if (isConexionError(error)) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.mensaje =
        opt.mensaje ||
        'Error de conexión, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      errorInfo.causa =
        opt.causa ||
        ('code' in error && typeof error.code === 'string' ? error.code : '')
      errorInfo.accion =
        opt.accion ||
        'Verifique la configuración de red y que el servicio al cual se intenta conectar se encuentre activo'
    }

    // IOP ERROR tipo 1 body = { message: "detalle del error" }
    else if (
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data &&
      Object.keys(error.response.data).length === 1 &&
      error.response.data.message &&
      typeof error.response.data.message === 'string'
    ) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.mensaje =
        opt.mensaje ||
        'Ocurrió un error inesperado, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      errorInfo.causa =
        opt.causa || `Posible problema con IOP ${error.response.data.message}`
      errorInfo.accion =
        opt.accion ||
        'Verificar que el servicio de INTEROPRABILIDAD se encuentre activo y respondiendo correctamente'
    }

    // IOP ERROR tipo 2 body = { data: "detalle del error" }
    else if (
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'data' in error.response.data &&
      Object.keys(error.response.data).length === 1 &&
      error.response.data.data &&
      typeof error.response.data.data === 'string'
    ) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.mensaje =
        opt.mensaje ||
        'Ocurrió un error inesperado, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      errorInfo.causa =
        opt.causa || `Posible problema con IOP ${error.response.data.data}`
      errorInfo.accion =
        opt.accion ||
        'Verificar que el servicio de INTEROPRABILIDAD se encuentre activo y respondiendo correctamente'
    }

    // UPSTREAM ERROR
    else if (
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      typeof error.response.data === 'string' &&
      error.response.data === 'The upstream server is timing out'
    ) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.mensaje =
        opt.mensaje ||
        'Ocurrió un error inesperado, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      errorInfo.causa = opt.causa || `${error.response.data}`
      errorInfo.accion =
        opt.accion ||
        'Verificar que el servicio al cual se intenta conectar se encuentre activo y respondiendo correctamente'
    }

    // CERT EXPIRED ERROR
    else if (isCertExpiredError(error)) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.mensaje =
        opt.mensaje ||
        'El certificado digital utilizado por un sitio web, aplicación o servicio ha caducado'
      errorInfo.causa =
        opt.causa ||
        ('code' in error && typeof error.code === 'string' ? error.code : '')
      errorInfo.accion = opt.accion || 'Renovar el certificado digital'
    }

    // HTTP ERROR
    else if (error instanceof HttpException) {
      errorInfo.codigo = opt.codigo || error.getStatus()
      errorInfo.mensaje = opt.mensaje || extractMessage(error)
      errorInfo.causa = opt.causa || `HttpException ${errorInfo.codigo}`
      errorInfo.accion =
        opt.accion ||
        (errorInfo.codigo < 500
          ? 'Verifique los datos de entrada e inténtelo nuevamente'
          : 'Más info en detalles')
      errorInfo.error = error.toString()
      errorInfo.detalle = []
    }

    // AXIOS ERROR
    else if (isAxiosError(error) && 'response' in error && error.response) {
      errorInfo.codigo =
        opt.codigo ||
        (typeof error.response === 'object' &&
        'status' in error.response &&
        typeof error.response.status === 'number'
          ? error.response.status
          : HttpStatus.INTERNAL_SERVER_ERROR)
      errorInfo.mensaje =
        opt.mensaje ||
        'Ocurrió un error con un servicio externo, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      errorInfo.causa =
        opt.causa || `Error HTTP ${errorInfo.codigo} (Servicio externo)`
      errorInfo.accion =
        opt.accion || 'Revisar la respuesta devuelta por el servicio externo'
    }

    // SQL ERROR
    else if (
      'name' in error &&
      (error.name === 'TypeORMError' || error.name === 'QueryFailedError')
    ) {
      errorInfo.causa = opt.causa || error.name
      errorInfo.accion = opt.accion || 'Verificar las consultas SQL'
    }

    return errorInfo
  }
}
