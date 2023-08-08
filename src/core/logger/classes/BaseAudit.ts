import { AuditEntry, BaseAuditOptions, Metadata } from '../types'
import { getReqID } from '../utilities'

export class BaseAudit {
  /**
   * Contexto para el que se creará el log de auditoría
   */
  contexto: string

  /**
   * Contexto para el que se creará el log de auditoría
   */
  mensaje?: string

  /**
   * Fecha en la que se registró el mensaje (YYYY-MM-DD HH:mm:ss.SSS)
   */
  fecha: string

  /**
   * Objeto que contiene información adicional
   */
  metadata?: Metadata

  constructor(opt: BaseAuditOptions) {
    this.contexto = opt.contexto
    this.mensaje = opt.mensaje
    this.metadata = opt.metadata
  }

  getLogEntry(): AuditEntry {
    const args: AuditEntry = {
      // level: 10,
      // time: Date.now(),
      context: this.contexto,
      reqId: getReqID(),
    }

    if (this.mensaje) {
      args.msg = this.mensaje
    }

    const metadata = this.metadata
    if (metadata && Object.keys(metadata).length > 0) {
      // para evitar conflictos con palabras reservadas
      Object.keys(metadata).map((key) => {
        if (['level', 'time', 'context', 'msg', 'reqId'].includes(key)) {
          args[`_${key}`] = metadata[key]
        } else {
          args[key] = metadata[key]
        }
      })
    }

    return args
  }
}
