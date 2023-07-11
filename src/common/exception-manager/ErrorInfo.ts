import { LogFields } from '../../core/logger'
import { HttpStatus } from '@nestjs/common'

export class ErrorInfo {
  codigo: HttpStatus // Código HTTP que será devuelto al cliente: 200 | 400 | 500 (se genera de forma automática en base a la causa detectada)
  mensaje: string // Mensaje para el cliente

  error: unknown // contenido original del error
  errorStack: string // Stack del error (se genera de forma automática)

  detalle: unknown[] // Detalle del error

  sistema: string // Identificador de la aplicación: app-backend | app-frontend | node-script
  causa: string // Tipo de error detectado: TYPED ERROR | CONEXION ERROR | IOP ERROR | UPSTREAM ERROR | HTTP ERROR | AXIOS ERROR | UNKNOWN ERROR (se genera de forma automática)
  origen: string // Ruta del archivo que originó el error (Ej: .../src/main.ts:24:4)
  accion: string // Mensaje que indica cómo resolver el error en base a la causa detectada

  errorHandler: string // Componente que esta capturando el error: HttpExceptionFilter | ScriptExceptionHandler | ExternalLogRegister
  traceStack: string // Stack del componente que capturó el error (se genera de forma automática)

  constructor(obj: object) {
    if (obj) Object.assign(this, obj)
  }

  obtenerMensajeCliente() {
    return this.mensaje
  }

  getLogLevel() {
    if (this.codigo >= 200 && this.codigo < 400) return 'trace'
    if (this.codigo >= 400 && this.codigo < 500) return 'warn'
    if (this.codigo >= 500) return 'error'
    return 'info'
  }

  toPrint() {
    const args: unknown[] = [
      '\n───────────────────────',
      `─ Mensaje : ${this.mensaje}`,
      `─ Causa   : ${this.causa}`,
      `─ Origen  : ${this.origen}`,
      `─ Acción  : ${this.accion}`,
      `─ Sistema : ${this.sistema}`,
      `─ Handler : ${this.errorHandler}`,
    ]

    if (this.detalle && this.detalle.length > 0) {
      args.push('\n───── Detalle ─────────')
      args.push(this.detalle)
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

    args.push(
      new LogFields({
        _codigo: this.codigo,
        _mensaje: this.mensaje,
        _causa: this.causa,
        _origen: this.origen,
        _accion: this.accion,
        _sistema: this.sistema,
        _errorHandler: this.errorHandler,
      })
    )
    return args
  }
}
