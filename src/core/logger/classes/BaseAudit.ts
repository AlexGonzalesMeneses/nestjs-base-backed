import { AuditEntry, AuditMetadata, BaseAuditOptions } from '../types'

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
  metadata?: AuditMetadata

  constructor(opt: BaseAuditOptions) {
    this.contexto = opt.contexto || 'application'
    this.mensaje = opt.mensaje
    this.metadata = opt.metadata
  }

  getLogEntry(): AuditEntry {
    const args: AuditEntry = {
      ctx: this.contexto,
    }

    if (this.mensaje) {
      args.msg = this.mensaje
    }

    if (this.metadata && Object.keys(this.metadata).length > 0) {
      Object.assign(args, this.metadata)
    }

    return args
  }
}
