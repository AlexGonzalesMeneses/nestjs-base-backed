import { LOG_LEVEL } from '../constants'

export interface LogEntry {
  level: LOG_LEVEL

  /**
   * Mensaje para el cliente
   */
  mensaje: string

  /**
   * Información adicional
   */
  detalle: unknown

  /**
   * Identificador de la aplicación. Ej: app-backend | app-frontend | node-script
   */
  sistema: string

  /**
   * Identificador del módulo. Ej: SEGIP, SIN, MENSAJERÍA
   */
  modulo: string

  /**
   * Fecha en la que se registró el mensaje (YYYY-MM-DD HH:mm:ss.SSS)
   */
  fecha: string

  /**
   * Stack del componente que registró el mensaje (se genera de forma automática)
   */
  traceStack: string

  /**
   * Devuelve el mensaje que se mostrará al cliente
   */
  obtenerMensajeCliente(): string

  /**
   * Devuelve el nivel de log en formato de texto
   */
  getLevel(): LOG_LEVEL

  /**
   * Devuelve el nivel de log en formato numérico
   */
  getNumericLevel(): number

  /**
   * Devuelve una cadena de texto con el contenido formateado
   */
  toString(): string
}
