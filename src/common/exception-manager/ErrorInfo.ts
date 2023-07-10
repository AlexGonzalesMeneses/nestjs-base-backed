import { HttpStatus } from '@nestjs/common'

export class ErrorInfo {
  codigo: HttpStatus // Código HTTP que será devuelto al cliente: 200 | 400 | 500 (se genera de forma automática en base a la causa detectada)
  mensaje: string // Mensaje para el cliente

  error: unknown // contenido original del error
  errorStack: string // Stack del error (se genera de forma automática)

  detalle: unknown[] // Detalle del error

  sistema: string // Identificador de la aplicación: app-backend | app-frontend | node-script
  causa: string // Tipo de error detectado: TYPED ERROR | CONEXION ERROR | IOP ERROR | UPSTREAM ERROR | HTTP ERROR | AXIOS ERROR | UNKNOWN ERROR (se genera de forma automática)
  origen: string // Sistema, servicio, módulo o componente que originó el error
  accion: string // Mensaje que indica cómo resolver el error en base a la causa detectada

  errorHandler: string // Componente que esta capturando el error: HttpExceptionFilter | ScriptExceptionHandler | ExternalLogRegister
  traceStack: string // Stack del componente que capturó el error (se genera de forma automática)

  constructor(obj: object) {
    if (obj) Object.assign(this, obj)
  }

  obtenerMensajeCliente() {
    if (this.origen) {
      return `${this.origen} :: ${this.mensaje}`
    }
    return this.mensaje
  }
}
