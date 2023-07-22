import { BaseLogOptions } from '../types'
import { cleanParamValue, getErrorStack } from '../utilities'
import { LOG_LEVEL, LOG_NUMBER } from '../constants'
import dayjs from 'dayjs'
import { LogEntry } from './LogEntry'
import { LoggerService } from './LoggerService'

export class BaseLog implements LogEntry {
  level: LOG_LEVEL
  mensaje: string
  detalle: unknown
  sistema: string
  modulo: string
  fecha: string
  traceStack: string

  constructor(opt?: BaseLogOptions) {
    const level = LOG_LEVEL.ERROR
    const detalle: unknown = ''
    const loggerParams = LoggerService.getLoggerParams()
    const sistema = loggerParams?.appName || ''
    const modulo = ''
    const traceStack = getErrorStack(new Error())
    const mensaje = ''
    const fecha = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')

    // GUARDAMOS LOS DATOS
    this.fecha = fecha
    this.level = opt && typeof opt.level !== 'undefined' ? opt.level : level
    this.mensaje =
      opt && typeof opt.mensaje !== 'undefined' ? opt.mensaje : mensaje
    this.sistema =
      opt && typeof opt.sistema !== 'undefined' ? opt.sistema : sistema
    this.modulo = opt && typeof opt.modulo !== 'undefined' ? opt.modulo : modulo
    this.traceStack =
      opt && typeof opt.traceStack !== 'undefined' ? opt.traceStack : traceStack

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

  toString(): string {
    return this.obtenerMensajeCliente()
  }
}
