import {
  LoggerService,
  cleanParamValue,
  getErrorStack,
  isAxiosError,
  isConexionError,
} from '../../core/logger'
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common'
import { Messages } from '../../common/constants/response-messages'
import { BaseException } from './BaseException'
import packageJson from '../../../package.json'

export type NormalizedError = {
  codigo: HttpStatus // Código HTTP que será devuelto al cliente: ^200 | ^400 | ^500 (se genera de forma automática)
  mensaje: string // Mensaje para el cliente

  errores: (string | object)[] // Detalle del error

  errorStack: string // Stack del error (se genera de forma automática)
  traceStack: string // Stack del componente que generó el error (se genera de forma automática)

  causa: string // Tipo de error detectado: TYPED ERROR | CONEXION ERROR | IOP ERROR | UPSTREAM ERROR | HTTP ERROR | AXIOS ERROR | UNKNOWN ERROR (se genera de forma automática)
  origen: string // Identificador de la aplicación: app-backend | app-frontend | node-script
  modulo: string // Componente que esta capturando el error: HttpExceptionFilter | ScriptExceptionHandler | ExternalLogRegister
  accion: string // Mensaje que indica cómo resolver el error según la causa detectada
}

export type ExceptionManagerParams = {
  logger?: LoggerService
}

export class ExceptionManager {
  private static logger: LoggerService | null = null

  static initialize(params: ExceptionManagerParams = {}) {
    ExceptionManager.logger = params.logger || null
  }

  static handleError(
    error: any,
    opt: {
      codigo?: number
      mensaje?: string
      causa?: string
      origen?: string
      modulo?: string
      accion?: string
    } = {}
  ): NormalizedError {
    const getOrigen = () => {
      return opt.origen || `${packageJson.name} v${packageJson.version}`
    }

    const errorInfo: NormalizedError = {
      codigo: opt.codigo || 500,
      mensaje: opt.mensaje || 'Error interno',
      errores: [],
      traceStack: '',
      errorStack: '',
      causa: opt.causa || '',
      origen: getOrigen(),
      modulo: opt.modulo || '',
      accion: opt.accion || '',
    }

    const buildClienteMessage = (msg: string) => {
      const msgBody = opt.mensaje || msg
      return msgBody
    }

    // ERRORES PERSONALIZADOS
    if (error instanceof BaseException) {
      errorInfo.codigo = error.codigo
      errorInfo.mensaje = error.mensaje
      errorInfo.errores = error.errores
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.errorStack = error.errorStack
      errorInfo.causa = error.causa
      errorInfo.origen = error.origen
      errorInfo.modulo = error.modulo
      errorInfo.accion = error.accion
    }

    // TYPED ERROR
    else if (!error || typeof error !== 'object') {
      errorInfo.codigo = opt.codigo || HttpStatus.BAD_REQUEST
      errorInfo.errores = [error]
      errorInfo.errorStack = ''
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.causa = 'Datos de entrada'
      errorInfo.origen = getOrigen()
      errorInfo.modulo = opt.modulo || ''
      errorInfo.accion =
        opt.accion || `Verificar el formato del objeto JSON enviado en el body`
      errorInfo.mensaje = buildClienteMessage(
        'Ocurrió un error inesperado, por favor verifique los datos de entrada e inténtelo nuevamente'
      )
      ExceptionManager.printErrorInfo(errorInfo)
    }

    // CONEXION ERROR
    else if (isConexionError(error)) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.errores = cleanParamValue([error])
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.errorStack = getErrorStack(error)
      errorInfo.causa = `${error.code}`
      errorInfo.origen = getOrigen()
      errorInfo.modulo = opt.modulo || ''
      errorInfo.accion =
        opt.accion ||
        `Verificar la configuración de red y que el servicio al cual se intenta conectar se encuentre activo`
      errorInfo.mensaje = buildClienteMessage(
        'Error de conexión, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      )
      ExceptionManager.printErrorInfo(errorInfo)
    }

    // IOP ERROR tipo 1 body = { message: "detalle del error" }
    else if (
      error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      Object.keys(error.response.data || {}).length === 1 &&
      error.response.data.message &&
      typeof error.response.data.message === 'string'
    ) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.errores = cleanParamValue([error])
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.errorStack = getErrorStack(error)
      errorInfo.causa = `Posible problema con IOP ${error.response.data.message}`
      errorInfo.origen = getOrigen()
      errorInfo.modulo = opt.modulo || ''
      errorInfo.accion =
        opt.accion ||
        `Verificar que el servicio de INTEROPRABILIDAD se encuentre activo y respondiendo correctamente`
      errorInfo.mensaje = buildClienteMessage(
        'Ocurrió un error inesperado, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      )
      ExceptionManager.printErrorInfo(errorInfo)
    }

    // IOP ERROR tipo 2 body = { data: "detalle del error" }
    else if (
      error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      Object.keys(error.response.data || {}).length === 1 &&
      error.response.data.data &&
      typeof error.response.data.data === 'string'
    ) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.errores = cleanParamValue([error])
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.errorStack = getErrorStack(error)
      errorInfo.causa = `Posible problema con IOP ${error.response.data.data}`
      errorInfo.origen = getOrigen()
      errorInfo.modulo = opt.modulo || ''
      errorInfo.accion =
        opt.accion ||
        `Verificar que el servicio de INTEROPRABILIDAD se encuentre activo y respondiendo correctamente`
      errorInfo.mensaje = buildClienteMessage(
        'Ocurrió un error inesperado, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      )
      ExceptionManager.printErrorInfo(errorInfo)
    }

    // UPSTREAM ERROR
    else if (
      error.response &&
      error.response.data === 'The upstream server is timing out'
    ) {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.errores = cleanParamValue([error])
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.errorStack = getErrorStack(error)
      errorInfo.causa = `${error.response.data.data}`
      errorInfo.origen = getOrigen()
      errorInfo.modulo = opt.modulo || ''
      errorInfo.accion = `Verificar que el servicio al cual se intenta conectar se encuentre activo`
      errorInfo.mensaje = buildClienteMessage(
        'Ocurrió un error inesperado, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      )
      ExceptionManager.printErrorInfo(errorInfo)
    }

    // HTTP ERROR
    else if (error instanceof HttpException) {
      const mensajeHttp = ExceptionManager.getMensaje(error)
      errorInfo.codigo = opt.codigo || ExceptionManager.getCodigo(error)
      errorInfo.errores = cleanParamValue(ExceptionManager.getErrores(error))
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.errorStack = getErrorStack(error)
      errorInfo.causa = opt.causa || `Error HTTP ${errorInfo.codigo}`
      errorInfo.origen = getOrigen()
      errorInfo.modulo = opt.modulo || ''
      errorInfo.accion =
        errorInfo.codigo < 500
          ? 'Verifique los datos de entrada e inténtelo nuevamente'
          : 'Revise el detalle del error'
      errorInfo.mensaje = buildClienteMessage(mensajeHttp)
      ExceptionManager.printErrorInfo(errorInfo)
    }

    // AXIOS ERROR
    else if (isAxiosError(error) && error.response) {
      errorInfo.codigo = opt.codigo || error.response.status
      errorInfo.errores = cleanParamValue([error])
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.errorStack = getErrorStack(error)
      errorInfo.causa =
        opt.causa || `Error HTTP ${errorInfo.codigo} (Servicio externo)`
      errorInfo.origen = getOrigen()
      errorInfo.modulo = opt.modulo || ''
      errorInfo.accion = `Verificar la respuesta devuelta por el servicio externo`
      errorInfo.mensaje = buildClienteMessage(
        'Ocurrió un error al consumir un servicio externo, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      )
      ExceptionManager.printErrorInfo(errorInfo)
    }

    // OTRO ERROR
    else {
      errorInfo.codigo = opt.codigo || HttpStatus.INTERNAL_SERVER_ERROR
      errorInfo.errores = cleanParamValue([error, error.toString()])
      errorInfo.traceStack = getErrorStack(new Error())
      errorInfo.errorStack = getErrorStack(error)
      errorInfo.causa = opt.causa || 'Error desconocido'
      errorInfo.origen = getOrigen()
      errorInfo.modulo = opt.modulo || ''
      errorInfo.accion = opt.accion || `Revisar los detalles del error`
      errorInfo.mensaje = buildClienteMessage(
        'Ocurrió un error inesperado, por favor vuelva a intentarlo o comuníquese con soporte técnico si el problema persiste'
      )
      ExceptionManager.printErrorInfo(errorInfo)
    }

    return errorInfo
  }

  private static printErrorInfo(errorInfo: NormalizedError) {
    const logger = ExceptionManager.logger
    if (!logger) return

    logger[errorInfo.codigo < 500 ? 'warn' : 'error'](
      `${errorInfo.codigo} - ${errorInfo.causa}`,
      '──────────────────────────',
      `─ Mensaje : ${errorInfo.mensaje}`,
      `─ Causa   : ${errorInfo.causa}`,
      `─ Origen  : ${errorInfo.origen}`,
      `─ Módulo  : ${errorInfo.modulo}`,
      `─ Acción  : ${errorInfo.accion}`,
      '\n───────── Errores ────────',
      errorInfo.errores,
      '\n───────── Error stack ────────',
      errorInfo.errorStack,
      '\n───────── Trace error stack ────────',
      errorInfo.traceStack
    )
  }

  private static getCodigo(exception: HttpException): number {
    return exception.getStatus()
  }

  private static getMensaje(exception: HttpException): string {
    const response = exception.getResponse() as ObjectOrError | string
    if (typeof response === 'string') {
      return ExceptionManager.traducirMensaje(response)
    }

    if (response.message && response.error) {
      if (typeof response.message === 'string') {
        return ExceptionManager.traducirMensaje(response.message)
      }

      const unicoMensajeTipoString =
        Array.isArray(response.message) &&
        response.message.length === 1 &&
        typeof response.message[0] === 'string'

      if (unicoMensajeTipoString) {
        return ExceptionManager.traducirMensaje(response.message[0])
      }
    }

    switch (exception.constructor) {
      case BadRequestException:
        return Messages.EXCEPTION_BAD_REQUEST
      case UnauthorizedException:
        return Messages.EXCEPTION_UNAUTHORIZED
      case NotFoundException:
        return Messages.EXCEPTION_NOT_FOUND
      case PreconditionFailedException:
        return Messages.EXCEPTION_PRECONDITION_FAILED
      case ForbiddenException:
        return Messages.EXCEPTION_FORBIDDEN
      default:
        return Messages.EXCEPTION_INTERNAL_SERVER_ERROR
    }
  }

  private static traducirMensaje(mensaje: string) {
    if (mensaje === 'Forbidden resource') {
      return Messages.EXCEPTION_FORBIDDEN
    }
    return mensaje
  }

  private static getErrores(exception: HttpException): (string | object)[] {
    const response = exception.getResponse() as ObjectOrError | string

    if (typeof response === 'string') {
      return []
    }

    if (!response.statusCode) {
      return [response]
    }

    if (!response.message) {
      return [response]
    }

    if (!Array.isArray(response.message)) {
      return []
    }

    const unicoMensajeTipoString =
      response.message.length === 1 && typeof response.message[0] === 'string'

    if (unicoMensajeTipoString) {
      return []
    }

    return response.message
  }
}

export type ObjectOrError = {
  statusCode?: number
  message?: string | object | (string | object)[]
  error?: string
}
