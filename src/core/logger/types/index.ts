import { Level } from 'pino'
import { LoggerService } from '../classes'
import { HttpStatus } from '@nestjs/common'

export type FileParams = {
  path: string
  size: string
  rotateInterval: string
  compress: string
}

export type LokiParams = {
  url: string
  username: string
  password: string
  batching: string
  batchInterval: string
}

export type LoggerParams = {
  appName: string
  level: string
  hide: string
  projectPath: string
  fileParams?: FileParams
  lokiParams?: LokiParams
  _levels: Level[]
}

export type LoggerOptions = {
  appName?: string
  level?: string
  hide?: string
  projectPath?: string
  fileParams?: Partial<FileParams>
  lokiParams?: Partial<LokiParams>
}

export type AppInfo = {
  name: string
  version: string
  env: string
  port: string
}

export type SQLLoggerParams = {
  logger: LoggerService
  level: {
    error: boolean
    query: boolean
  }
}

export type SQLLoggerOptions = Partial<SQLLoggerParams>

export type SQLLogLevel = {
  error: boolean
  query: boolean
}

export type BaseExceptionOptions = {
  httpStatus?: HttpStatus
  mensaje?: string
  errorStack?: string
  detalle?: unknown
  sistema?: string
  modulo?: string
  causa?: string
  origen?: string
  accion?: string
  traceStack?: string
}

export type ObjectOrError = {
  statusCode?: number
  message?: string | object | (string | object)[]
  error?: string
}
