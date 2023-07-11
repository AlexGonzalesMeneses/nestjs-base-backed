export type HandleErrorParams = {
  codigo: number
  mensaje: string
  detalle: unknown[]
  sistema: string
  causa: string
  origen: string
  accion: string
}

export type HandleErrorOptions = Partial<HandleErrorParams>

export type ObjectOrError = {
  statusCode?: number
  message?: string | object | (string | object)[]
  error?: string
}
