import { LoggerService } from './LoggerService'
import { BaseExceptionOptions, BaseLogOptions } from '../types'
import {
  cleanParamValue,
  getErrorStack,
  isAxiosError,
  isCertExpiredError,
  isConexionError,
} from '../utilities'
import { HttpException, HttpStatus } from '@nestjs/common'
import { extractMessage } from '../utils'
import { ERROR_CODE, LOG_LEVEL, LOG_NUMBER } from '../constants'
import dayjs from 'dayjs'
import { LogEntry } from './LogEntry'
import { inspect } from 'util'

export class BaseException extends Error implements LogEntry {
  level: LOG_LEVEL
  mensaje: string
  detalle: unknown
  sistema: string
  modulo: string
  fecha: string
  traceStack: string

  /**
   * Código que indica el tipo de error detectado
   */
  codigo: ERROR_CODE

  /**
   * Código HTTP en caso de que el tipo de excepción sea HTTP
   */
  httpStatus: HttpStatus

  /**
   * contenido original del error (parseado)
   */
  error?: unknown

  /**
   * Stack del error (se genera de forma automática)
   */
  errorStack?: string

  /**
   * Tipo de error detectado: TYPED ERROR | CONEXION ERROR | IOP ERROR | UPSTREAM ERROR | HTTP ERROR | AXIOS ERROR | UNKNOWN ERROR (se genera de forma automática)
   */
  causa: string

  /**
   * Ruta del archivo que originó el error (Ej: .../src/main.ts:24:4)
   */
  origen: string

  /**
   * Mensaje que indica cómo resolver el error en base a la causa detectada
   */
  accion: string

  constructor(error: unknown, opt?: BaseExceptionOptions | BaseLogOptions) {
    super(BaseException.name)

    // UNKNOWN_ERROR
    let codigo = ERROR_CODE.UNKNOWN_ERROR
    const errorString =
      error instanceof Error
        ? error.toString()
        : 'El error no es una instancia de la clase Error'
    const errorStack =
      error instanceof BaseException
        ? error.errorStack
        : error instanceof Error
        ? getErrorStack(error)
        : getErrorStack(new Error())

    let detalle: unknown = ''
    const loggerParams = LoggerService.getLoggerParams()
    let sistema = loggerParams?.appName || ''
    let modulo = ''
    let origen = errorStack ? errorStack.split('\n').shift() || '' : ''
    const traceStack =
      error instanceof BaseException
        ? error.traceStack
        : getErrorStack(new Error())

    let errorParsed: unknown = error
      ? error instanceof BaseException
        ? error.error
        : cleanParamValue(error)
      : undefined

    let httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    let mensaje = `Error Interno (${ERROR_CODE.UNKNOWN_ERROR})`
    let causa = errorString
    let accion = ''
    let fecha = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')

    // EMPTY_ERROR
    if (!error) {
      mensaje = `Ocurrió un error interno (${ERROR_CODE.EMPTY_ERROR})`
    }

    // STRING_ERROR
    else if (typeof error === 'string') {
      codigo = ERROR_CODE.STRING_ERROR
      mensaje = `${error} (${ERROR_CODE.STRING_ERROR})`
    }

    // BASE_EXCEPTION
    else if (error instanceof BaseException) {
      codigo = error.codigo
      httpStatus = error.httpStatus
      mensaje = error.mensaje
      causa = error.causa
      accion = error.accion
      sistema = error.sistema
      modulo = error.modulo
      origen = error.origen
      detalle = error.detalle
      fecha = error.fecha
      errorParsed = error.error
    }

    // SERVER_CONEXION
    else if (isConexionError(error)) {
      codigo = ERROR_CODE.SERVER_CONEXION
      mensaje = `Error de conexión con un servicio externo (${ERROR_CODE.SERVER_CONEXION})`
      accion = `Verifique la configuración de red y que el servicio al cual se intenta conectar se encuentre activo`
    }

    // SERVER_ERROR_1
    else if (
      typeof error === 'object' &&
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
      codigo = ERROR_CODE.SERVER_ERROR_1
      mensaje = `Ocurrió un error con un servicio externo (${ERROR_CODE.SERVER_ERROR_1})`
      causa = error.response.data.message // TODO error.toString() ???
      accion = `Verificar que el servicio en cuestión se encuentre activo y respondiendo correctamente`
    }

    // SERVER_ERROR_2
    else if (
      typeof error === 'object' &&
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
      codigo = ERROR_CODE.SERVER_ERROR_2
      mensaje = `Ocurrió un error con un servicio externo (${ERROR_CODE.SERVER_ERROR_2})`
      causa = error.response.data.data // TODO error.toString() ???
      accion = `Verificar que el servicio en cuestión se encuentre activo y respondiendo correctamente`
    }

    // SERVER_TIMEOUT
    else if (
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      typeof error.response.data === 'string' &&
      error.response.data === 'The upstream server is timing out'
    ) {
      codigo = ERROR_CODE.SERVER_TIMEOUT
      mensaje = `Ocurrió un error con un servicio externo (${ERROR_CODE.SERVER_TIMEOUT})`
      causa = error.response.data // TODO error.toString() ???
      accion = `Verificar que el servicio al cual se intenta conectar se encuentre activo y respondiendo correctamente`
    }

    // SERVER_CERT_EXPIRED
    else if (isCertExpiredError(error)) {
      codigo = ERROR_CODE.SERVER_CERT_EXPIRED
      mensaje = `Ocurrió un error con un servicio externo (${ERROR_CODE.SERVER_CERT_EXPIRED})`
      causa =
        typeof error === 'object' &&
        'code' in error &&
        typeof error.code === 'string'
          ? error.code
          : '' // TODO error.toString() ???
      accion = `Renovar el certificado digital`
    }

    // HTTP_EXCEPTION
    else if (error instanceof HttpException) {
      codigo = ERROR_CODE.HTTP_EXCEPTION
      httpStatus = error.getStatus()
      mensaje = extractMessage(error)
      causa = `HttpException ${httpStatus}` // TODO error.toString() ???
      accion =
        httpStatus === HttpStatus.BAD_REQUEST
          ? 'Verifique que los datos de entrada se estén enviando correctamente'
          : httpStatus === HttpStatus.UNAUTHORIZED
          ? 'Verifique que las credenciales de acceso se estén enviando correctamente'
          : httpStatus === HttpStatus.FORBIDDEN
          ? 'Verifique que el usuario actual tenga acceso a este recurso'
          : httpStatus === HttpStatus.NOT_FOUND
          ? 'Verifique que el recurso solicitado realmente exista'
          : httpStatus === HttpStatus.REQUEST_TIMEOUT
          ? 'Verifique que el servicio responda en un tiempo menor al tiempo máximo de espera establecido en la variable de entorno REQUEST_TIMEOUT_IN_SECONDS'
          : httpStatus === HttpStatus.PRECONDITION_FAILED
          ? 'Verifique que se cumpla con todas las condiciones requeridas para consumir este recurso'
          : 'Más info en detalles'
      errorParsed = null
    }

    // AXIOS_ERROR
    else if (
      isAxiosError(error) &&
      typeof error === 'object' &&
      'response' in error &&
      error.response
    ) {
      codigo = ERROR_CODE.AXIOS_ERROR
      httpStatus =
        typeof error.response === 'object' &&
        'status' in error.response &&
        typeof error.response.status === 'number'
          ? error.response.status
          : HttpStatus.INTERNAL_SERVER_ERROR
      mensaje = `Ocurrió un error con un servicio externo (${ERROR_CODE.AXIOS_ERROR})`
      causa = `Error HTTP ${httpStatus} (Servicio externo)`
      accion = 'Revisar la respuesta devuelta por el servicio externo'
    }

    // SQL_ERROR
    else if (
      typeof error === 'object' &&
      'name' in error &&
      (error.name === 'TypeORMError' || error.name === 'QueryFailedError')
    ) {
      codigo = ERROR_CODE.SQL_ERROR
      mensaje = `Ocurrió un error interno (${ERROR_CODE.SQL_ERROR})`
      accion = 'Verificar la consulta SQL'
    }

    // GUARDANDO VALORES
    this.error = errorParsed
    this.codigo = codigo
    this.fecha = fecha

    this.httpStatus =
      opt && 'httpStatus' in opt && typeof opt.httpStatus !== 'undefined'
        ? opt.httpStatus
        : httpStatus

    this.level =
      opt && 'level' in opt && typeof opt.level !== 'undefined'
        ? opt.level
        : this.levelByStatus(this.httpStatus)

    this.mensaje =
      opt && 'mensaje' in opt && typeof opt.mensaje !== 'undefined'
        ? opt.mensaje
        : mensaje

    if (opt && 'detalle' in opt && typeof opt.detalle !== 'undefined') {
      if (detalle) {
        const nuevoDetalle: unknown[] = []
        if (Array.isArray(opt.detalle)) {
          opt.detalle.forEach((d) => nuevoDetalle.push(cleanParamValue(d)))
        } else {
          nuevoDetalle.push(cleanParamValue(opt.detalle))
        }
        if (Array.isArray(detalle)) {
          detalle.forEach((d) => nuevoDetalle.push(d))
        } else {
          nuevoDetalle.push(detalle)
        }
        this.detalle = nuevoDetalle
      } else {
        this.detalle = cleanParamValue(opt.detalle)
      }
    } else {
      this.detalle = detalle
    }

    this.sistema =
      opt && 'sistema' in opt && typeof opt.sistema !== 'undefined'
        ? opt.sistema
        : sistema

    this.modulo =
      opt && 'modulo' in opt && typeof opt.modulo !== 'undefined'
        ? opt.modulo
        : modulo

    this.traceStack =
      opt && 'traceStack' in opt && typeof opt.traceStack !== 'undefined'
        ? opt.traceStack
        : traceStack

    this.errorStack =
      opt && 'errorStack' in opt && typeof opt.errorStack !== 'undefined'
        ? opt.errorStack
        : errorStack

    this.causa =
      opt && 'causa' in opt && typeof opt.causa !== 'undefined'
        ? opt.causa
        : causa

    this.origen =
      opt && 'origen' in opt && typeof opt.origen !== 'undefined'
        ? opt.origen
        : origen

    this.accion =
      opt && 'accion' in opt && typeof opt.accion !== 'undefined'
        ? opt.accion
        : accion
  }

  getAccion() {
    return this.accion
  }

  getCausa() {
    return this.causa
  }

  getHttpStatus() {
    return this.httpStatus
  }

  obtenerMensajeCliente() {
    return this.modulo ? `${this.modulo} :: ${this.mensaje}` : this.mensaje
  }

  getLevel() {
    return this.level
  }

  getNumericLevel() {
    return LOG_NUMBER[this.level]
  }

  private levelByStatus(status: number) {
    if (status < HttpStatus.BAD_REQUEST) {
      return LOG_LEVEL.TRACE
    }
    if (status < HttpStatus.INTERNAL_SERVER_ERROR) {
      return LOG_LEVEL.WARN
    }
    return LOG_LEVEL.ERROR
  }

  toString(): string {
    const args: string[] = []
    args.push('\n───────────────────────')
    args.push(`─ Mensaje : ${this.obtenerMensajeCliente()}`)

    if (this.causa) {
      args.push(`─ Causa   : ${this.causa}`)
    }

    if (this.origen) {
      args.push(`─ Origen  : ${this.origen}`)
    }

    if (this.accion) {
      args.push(`─ Acción  : ${this.accion}`)
    }

    if (this.detalle) {
      // detalle = [{ some: 'value' }, 'información adicional']
      if (Array.isArray(this.detalle)) {
        if (this.detalle.length > 0) {
          args.push('\n───── Detalle ─────────')
          this.detalle.map((item) => {
            args.push(
              typeof item === 'string'
                ? item
                : inspect(item, false, null, false)
            )
            args.push('')
          })
        }
      }

      // detalle = { some: 'value' }
      else {
        args.push('\n───── Detalle ─────────')
        args.push(
          typeof this.detalle === 'string'
            ? this.detalle
            : inspect(this.detalle, false, null, false)
        )
      }
    }

    if (
      this.error &&
      typeof this.error === 'object' &&
      Object.keys(this.error).length > 0
    ) {
      args.push('\n───── Error ───────────')
      args.push(inspect(this.error, false, null, false))
    }

    if (this.errorStack) {
      args.push('\n───── Error stack ─────')
      args.push(this.errorStack)
    }

    if (this.traceStack) {
      args.push('\n───── Trace stack ─────')
      args.push(this.traceStack)
    }

    return args.join('\n')
  }
}
