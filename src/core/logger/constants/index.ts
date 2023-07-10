import { LoggerService } from '../core'
import { LoggerParams, SQLLoggerParams } from '../types'

export enum COLOR {
  BLACK = `\x1b[30m`,
  RED = `\x1b[31m`,
  GREEN = `\x1b[32m`,
  YELLOW = `\x1b[33m`,
  BLUE = `\x1b[34m`,
  MAGENTA = `\x1b[35m`,
  CYAN = `\x1b[36m`,
  LIGHT_GREY = `\x1b[90m`,
  LIGHT_RED = `\x1b[91m`,
  LIGHT_GREEN = `\x1b[92m`,
  LIGHT_YELLOW = `\x1b[93m`,
  LIGHT_BLUE = `\x1b[94m`,
  LIGHT_MAGENTA = `\x1b[95m`,
  LIGHT_CYAN = `\x1b[96m`,
  LIGHT_WHITE = `\x1b[97m`,
  RESET = '\x1b[0m',
}

//Más info:  https://betterstack.com/community/guides/logging/log-levels-explained/
export enum LOG_LEVEL {
  FATAL = 'fatal', // 60 Mensajes críticos (Ej.: conexión a la base de datos)
  ERROR = 'error', // 50 Mensajes de error (Ej.: errores del lado del servidor HTTP 500)
  WARN = 'warn', // 40 Mensajes de advertencia (Ej.: errores del lado del cliente HTTP 400)
  INFO = 'info', // 30 Mensajes informativos (Ej.: cuando un servicio ha sido iniciado o detenido, cuando un componente ha sido activado)
  DEBUG = 'debug', // 20 Mensajes para el desarrollador (Ej.: Información detallada que puede ayudar al desarrollador a resolver un problema - puede activarse en prod temporalmente)
  TRACE = 'trace', // 10 Mensajes para el desarrollador (Ej.: Para rastrear la ruta de ejecución del código en un programa - solo para test y desarrollo)
}

export const LOG_COLOR = {
  [LOG_LEVEL.FATAL]: COLOR.RED,
  [LOG_LEVEL.ERROR]: COLOR.LIGHT_RED,
  [LOG_LEVEL.WARN]: COLOR.YELLOW,
  [LOG_LEVEL.INFO]: COLOR.CYAN,
  [LOG_LEVEL.DEBUG]: COLOR.LIGHT_MAGENTA,
  [LOG_LEVEL.TRACE]: COLOR.LIGHT_GREY,
}

export const DEFAULT_PARAMS: LoggerParams = {
  appName: 'app',
  level: 'info',
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
  _levels: [],
}

export const CLEAN_PARAM_VALUE_MAX_DEEP = 10

export const DEFAULT_SENSITIVE_PARAMS: string[] = [
  'contrasena',
  'password',
  'authorization',
  'cookie',
  'token',
  'access_token',
  'idToken',
  'accessToken',
  'refreshToken',
]

export const DEFAULT_SQL_LOGGER_PARAMS: SQLLoggerParams = {
  logger: { error: (...params) => console.error(...params) } as LoggerService,
  level: {
    error: true,
    query: true,
  },
}
