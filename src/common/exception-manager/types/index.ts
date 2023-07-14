export type ErrorParams = {
  codigo?: number
  mensaje?: string
  error?: unknown
  errorStack?: string
  detalle?: unknown[]
  sistema?: string
  causa?: string
  origen?: string
  accion?: string
  request?: RequestInfo
  response?: ResponseInfo
  traceStack?: string
}

export type ObjectOrError = {
  statusCode?: number
  message?: string | object | (string | object)[]
  error?: string
}

export type RequestInfo = {
  method?: string
  originalUrl?: string
  headers?: object
  params?: object
  query?: object
  body?: unknown
  user?: unknown
}

export type ResponseInfo = {
  finalizado?: boolean
  codigo?: number
  timestamp?: number
  mensaje?: string
  datos?: unknown
}
