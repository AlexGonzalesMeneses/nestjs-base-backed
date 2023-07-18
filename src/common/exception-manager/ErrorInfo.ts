import { HttpStatus } from '@nestjs/common'
import { LOG_LEVEL, LogFields, getErrorStack } from '../../core/logger'
import { ErrorParams, RequestInfo } from './types'
import { HttpMessages } from './messages'
import packageJson from '../../../package.json'

export class ErrorInfo {
  codigo: number = HttpStatus.INTERNAL_SERVER_ERROR // Código HTTP que será devuelto al cliente: 200 | 400 | 500 (se genera de forma automática en base a la causa detectada)
  mensaje: string = HttpMessages.EXCEPTION_INTERNAL_SERVER_ERROR // Mensaje para el cliente
  error?: unknown // contenido original del error
  errorStack?: string // Stack del error (se genera de forma automática)
  detalle: unknown[] = [] // Detalle del error
  sistema = `${packageJson.name} v${packageJson.version}` // Identificador de la aplicación: app-backend | app-frontend | node-script
  modulo = '' // Identificador del módulo que esta produciendo el error
  causa = '' // Tipo de error detectado: TYPED ERROR | CONEXION ERROR | IOP ERROR | UPSTREAM ERROR | HTTP ERROR | AXIOS ERROR | UNKNOWN ERROR (se genera de forma automática)
  origen = '' // Ruta del archivo que originó el error (Ej: .../src/main.ts:24:4)
  accion = '' // Mensaje que indica cómo resolver el error en base a la causa detectada
  traceStack = getErrorStack(new Error()) // Stack del componente que capturó el error (se genera de forma automática)
  request?: RequestInfo // Datos de la petición del cliente

  constructor(obj: ErrorParams) {
    if (typeof obj.codigo !== 'undefined') this.codigo = obj.codigo
    if (typeof obj.mensaje !== 'undefined') this.mensaje = obj.mensaje
    if (typeof obj.error !== 'undefined') this.error = obj.error
    if (typeof obj.errorStack !== 'undefined') this.errorStack = obj.errorStack
    if (typeof obj.detalle !== 'undefined') this.detalle = obj.detalle
    if (typeof obj.sistema !== 'undefined') this.sistema = obj.sistema
    if (typeof obj.modulo !== 'undefined') this.modulo = obj.modulo
    if (typeof obj.causa !== 'undefined') this.causa = obj.causa
    if (typeof obj.origen !== 'undefined') this.origen = obj.origen
    if (typeof obj.accion !== 'undefined') this.accion = obj.accion
    if (typeof obj.traceStack !== 'undefined') this.traceStack = obj.traceStack
    if (typeof obj.request !== 'undefined') this.request = obj.request
  }

  obtenerMensajeCliente() {
    return this.modulo ? `${this.modulo} :: ${this.mensaje}` : this.mensaje
  }

  getLogLevel() {
    if (this.codigo && this.codigo < 400) return LOG_LEVEL.TRACE
    if (this.codigo && this.codigo < 500) return LOG_LEVEL.WARN
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

    if (this.detalle && this.detalle.length > 0) {
      args.push('\n───── Detalle ─────────')
      this.detalle.map((item) => {
        args.push(item)
        args.push('---')
      })
    }

    if (this.error) {
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

    if (this.request) {
      args.push('\n───── Request ─────────')
      args.push(this.request)
    }

    args.push(
      new LogFields({
        _levelText: this.getLogLevel(),
        _codigo: this.codigo,
        _mensaje: this.mensaje,
        _causa: this.causa,
        _origen: this.origen,
        _accion: this.accion,
        _sistema: this.sistema,
        _modulo: this.modulo,
      })
    )
    return args
  }
}
