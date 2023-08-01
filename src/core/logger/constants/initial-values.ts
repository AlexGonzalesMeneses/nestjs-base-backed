import { LoggerService } from '../classes'
import { LoggerParams, SQLLoggerParams } from '../types'

export const DEFAULT_PARAMS: LoggerParams = {
  appName: 'app',
  level: 'info,warn,error',
  hide: '',
  projectPath: process.cwd(),
  fileParams: {
    path: '',
    size: '5M',
    rotateInterval: '1d',
    compress: 'false',
  },
  lokiParams: {
    url: '',
    username: '',
    password: '',
    batching: 'true',
    batchInterval: '5', // en segundos
  },
  auditParams: {
    context: 'application',
  },
  _levels: [],
  _audit: [],
}

export const CLEAN_PARAM_VALUE_MAX_DEEP = 10

export const DEFAULT_SENSITIVE_PARAMS: string[] = [
  'contrasena',
  'contrasenanueva',
  'password',
  'authorization',
  'cookie',
  'token',
  'idtoken',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
]

export const DEFAULT_SQL_LOGGER_PARAMS: SQLLoggerParams = {
  logger: {
    error: (...params: unknown[]) => console.error(...params),
  } as LoggerService,
  level: {
    error: true,
    query: true,
  },
}
