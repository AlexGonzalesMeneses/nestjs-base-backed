import { BaseExceptionOptions } from '../types'
import {
  cleanParamValue,
  getErrorStack,
  isAxiosError,
  isCertExpiredError,
  isConexionError,
} from '../utilities'
import { HttpException, HttpStatus } from '@nestjs/common'
import { extractMessage } from '../utils'
import packageJson from '../../../../package.json'
import { ERROR_CODE, LOG_LEVEL } from '../constants'
import { LogFields } from './LogFields'
import dayjs from 'dayjs'

export class BaseException extends Error {
  private codigo: ERROR_CODE

  /**
   * Código HTTP que será devuelto al cliente: 200 | 400 | 500 (se genera de forma automática en base a la causa detectada)
   */
  private httpStatus: HttpStatus

  /**
   * Mensaje para el cliente
   */
  private mensaje: string

  /**
   * contenido original del error (parseado)
   */
  private error?: unknown

  /**
   * Stack del error (se genera de forma automática)
   */
  private errorStack?: string

  /**
   * Información adicional para determinar la causa del error
   */
  private detalle: unknown

  /**
   * Identificador de la aplicación: app-backend | app-frontend | node-script
   */
  private sistema = ''

  /**
   * Identificador del módulo que esta produciendo el error
   */
  private modulo = ''

  /**
   * Tipo de error detectado: TYPED ERROR | CONEXION ERROR | IOP ERROR | UPSTREAM ERROR | HTTP ERROR | AXIOS ERROR | UNKNOWN ERROR (se genera de forma automática)
   */
  private causa = ''

  /**
   * Ruta del archivo que originó el error (Ej: .../src/main.ts:24:4)
   */
  private origen = ''

  /**
   * Mensaje que indica cómo resolver el error en base a la causa detectada
   */
  private accion = ''

  /**
   * Fecha en la que se registró el mensaje (YYYY-MM-DD HH:mm:ss.SSS)
   */
  private fecha = ''

  /**
   * Stack del componente que capturó el error (se genera de forma automática)
   */
  private traceStack = getErrorStack(new Error())

  constructor(error: unknown, opt?: BaseExceptionOptions) {
    super(BaseException.name)

    // UNKNOWN_ERROR
    let codigo = ERROR_CODE.UNKNOWN_ERROR
    const errorString = error instanceof Error ? error.toString() : ''
    const errorStack =
      error instanceof Error
        ? error instanceof BaseException
          ? error.errorStack
          : getErrorStack(error)
        : undefined

    let detalle: unknown = ''
    let sistema = `${packageJson.name} v${packageJson.version}`
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

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    let mensaje = `Error Interno (código ${ERROR_CODE.UNKNOWN_ERROR})`
    let causa = errorString
    let accion = ''
    let fecha = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')

    // EMPTY_ERROR
    if (!error) {
      mensaje = `Ocurrió un error interno (código: ${ERROR_CODE.EMPTY_ERROR})`
    }

    // STRING_ERROR
    else if (typeof error === 'string') {
      codigo = ERROR_CODE.STRING_ERROR
      mensaje = `${error} (código ${ERROR_CODE.STRING_ERROR})`
    }

    // NOT_ERROR_INSTANCE
    else if (!(error instanceof Error)) {
      codigo = ERROR_CODE.NOT_ERROR_INSTANCE
      mensaje = `Ocurrió un error interno (código: ${ERROR_CODE.NOT_ERROR_INSTANCE})`
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
    }

    // SERVER_CONEXION
    else if (isConexionError(error)) {
      codigo = ERROR_CODE.SERVER_CONEXION
      mensaje = `Error de conexión con un servicio externo (código ${ERROR_CODE.SERVER_CONEXION})`
      accion = `Verifique la configuración de red y que el servicio al cual se intenta conectar se encuentre activo`
    }

    // SERVER_ERROR_1
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
      codigo = ERROR_CODE.SERVER_ERROR_1
      mensaje = `Ocurrió un error con un servicio externo (código: ${ERROR_CODE.SERVER_ERROR_1})`
      causa = error.response.data.message // TODO error.toString() ???
      accion = `Verificar que el servicio en cuestión se encuentre activo y respondiendo correctamente`
    }

    // SERVER_ERROR_2
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
      codigo = ERROR_CODE.SERVER_ERROR_2
      mensaje = `Ocurrió un error con un servicio externo (código: ${ERROR_CODE.SERVER_ERROR_2})`
      causa = error.response.data.data // TODO error.toString() ???
      accion = `Verificar que el servicio en cuestión se encuentre activo y respondiendo correctamente`
    }

    // SERVER_TIMEOUT
    else if (
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      typeof error.response.data === 'string' &&
      error.response.data === 'The upstream server is timing out'
    ) {
      codigo = ERROR_CODE.SERVER_TIMEOUT
      mensaje = `Ocurrió un error con un servicio externo (código: ${ERROR_CODE.SERVER_TIMEOUT})`
      causa = error.response.data // TODO error.toString() ???
      accion = `Verificar que el servicio al cual se intenta conectar se encuentre activo y respondiendo correctamente`
    }

    // SERVER_CERT_EXPIRED
    else if (isCertExpiredError(error)) {
      codigo = ERROR_CODE.SERVER_CERT_EXPIRED
      mensaje = `Ocurrió un error con un servicio externo (código ${ERROR_CODE.SERVER_CERT_EXPIRED})`
      causa =
        'code' in error && typeof error.code === 'string' ? error.code : '' // TODO error.toString() ???
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
    else if (isAxiosError(error) && 'response' in error && error.response) {
      codigo = ERROR_CODE.AXIOS_ERROR
      httpStatus =
        typeof error.response === 'object' &&
        'status' in error.response &&
        typeof error.response.status === 'number'
          ? error.response.status
          : HttpStatus.INTERNAL_SERVER_ERROR
      mensaje = `Ocurrió un error con un servicio externo (código: ${ERROR_CODE.AXIOS_ERROR})`
      causa = `Error HTTP ${httpStatus} (Servicio externo)`
      accion = 'Revisar la respuesta devuelta por el servicio externo'
    }

    // SQL_ERROR
    else if (
      'name' in error &&
      (error.name === 'TypeORMError' || error.name === 'QueryFailedError')
    ) {
      codigo = ERROR_CODE.SQL_ERROR
      mensaje = `Ocurrió un error interno (código ${ERROR_CODE.SQL_ERROR})`
      accion = 'Verificar la consulta SQL'
    }

    // GUARDANDO VALORES
    this.error = errorParsed
    this.codigo = codigo
    this.fecha = fecha

    this.httpStatus =
      opt && typeof opt.httpStatus !== 'undefined' ? opt.httpStatus : httpStatus
    this.mensaje =
      opt && typeof opt.mensaje !== 'undefined' ? opt.mensaje : mensaje
    this.errorStack =
      opt && typeof opt.errorStack !== 'undefined' ? opt.errorStack : errorStack
    this.sistema =
      opt && typeof opt.sistema !== 'undefined' ? opt.sistema : sistema
    this.modulo = opt && typeof opt.modulo !== 'undefined' ? opt.modulo : modulo
    this.causa = opt && typeof opt.causa !== 'undefined' ? opt.causa : causa
    this.origen = opt && typeof opt.origen !== 'undefined' ? opt.origen : origen
    this.accion = opt && typeof opt.accion !== 'undefined' ? opt.accion : accion
    this.traceStack =
      opt && typeof opt.traceStack !== 'undefined' ? opt.traceStack : traceStack

    if (opt && typeof opt.detalle !== 'undefined') {
      this.detalle = detalle ? [opt.detalle, detalle] : opt.detalle
    } else {
      this.detalle = detalle
    }
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

  getLogLevel() {
    if (this.httpStatus && this.httpStatus < 400) return LOG_LEVEL.TRACE
    if (this.httpStatus && this.httpStatus < 500) return LOG_LEVEL.WARN
    return LOG_LEVEL.ERROR
  }

  toPrint() {
    const args: unknown[] = []
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
            args.push(item)
            args.push('')
          })
        }
      }

      // detalle = { some: 'value' }
      else {
        args.push('\n───── Detalle ─────────')
        args.push(this.detalle)
      }
    }

    if (
      this.error &&
      typeof this.error === 'object' &&
      Object.keys(this.error).length > 0
    ) {
      args.push('\n───── Error ───────────')
      args.push(this.error)
    }

    if (this.errorStack) {
      args.push('\n───── Error stack ─────')
      args.push(this.errorStack)
    }

    if (this.traceStack) {
      args.push('\n───── Trace stack ─────')
      args.push(this.traceStack)
    }

    args.push(
      new LogFields({
        _levelText: this.getLogLevel(),
        _httpStatus: this.httpStatus,
        _codigo: this.codigo,
        _mensaje: this.mensaje,
        _causa: this.causa,
        _origen: this.origen,
        _accion: this.accion,
        _sistema: this.sistema,
        _modulo: this.modulo,
        _fecha: this.fecha,
      })
    )
    return args
  }
}
