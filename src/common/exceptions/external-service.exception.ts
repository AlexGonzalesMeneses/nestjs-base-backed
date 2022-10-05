export class ExternalServiceException extends Error {
  mensaje: string
  errores: (string | object)[]
  stack: string | undefined

  constructor(name: string, error?: Error | unknown, message?: string) {
    super()

    const msg = message ? ` - ${message}` : ''
    this.mensaje = `Error con el Servicio Web ${name}${msg}`
    this.errores = error ? [error] : []
    this.stack = error instanceof Error ? error.stack : undefined

    if (error instanceof ExternalServiceException) {
      this.mensaje = error.mensaje
      this.errores = error.errores
      this.stack = error.stack
    }
  }
}
