import { AxiosError } from 'axios'
import { INestApplication } from '@nestjs/common'
import dayjs from 'dayjs'
import path from 'path'
import { PinoLogger } from 'nestjs-pino'
import { inspect } from 'util'
import { COLOR, LOG_COLOR, LOG_LEVEL } from './constants'
import fastRedact from 'fast-redact'
import { LoggerConfig } from './logger.config'
import { toJSON } from 'flatted'

export class LoggerService {
  static _instance: LoggerService | null = null
  private static _pinoInstance: PinoLogger | null = null
  private readonly redact: fastRedact.redactFn

  constructor() {
    this.redact = fastRedact(LoggerConfig.redactOptions())
  }

  static async initialize(app: INestApplication) {
    const pinoLogger = await app.resolve<PinoLogger>(PinoLogger)
    LoggerService._pinoInstance = pinoLogger
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getInstance(context?: string) {
    if (LoggerService._instance) {
      return LoggerService._instance
    }
    const logger = new LoggerService()
    LoggerService._instance = logger
    return LoggerService._instance
  }

  getContext(): string {
    try {
      const projectPath = path.resolve(__dirname, '../../../../')
      const method = String(new Error().stack)
        .split('\n')
        .slice(4)
        .map((line) => line.replace(new RegExp(projectPath, 'g'), '...'))
        .filter((line) => line.includes('.../src'))
        .map((line) => line.split('/').pop()?.slice(0, -1))
        .shift()
      return method || '-'
    } catch (e) {
      return '-'
    }
  }

  /**
   * @deprecated Cambiado por el método info. Ej: this.loggger.info('message')
   * @param optionalParams
   */
  log(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.INFO, ...optionalParams)
  }

  /**
   * @deprecated Cambiado por el método trace. Ej: this.loggger.trace('message')
   * @param optionalParams
   */
  verbose(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.TRACE, ...optionalParams)
  }

  error(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.ERROR, ...optionalParams)
  }

  warn(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.WARN, ...optionalParams)
  }

  info(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.INFO, ...optionalParams)
  }

  debug(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.DEBUG, ...optionalParams)
  }

  trace(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.TRACE, ...optionalParams)
  }

  static cleanAxiosResponse(value: any, deep = 0) {
    // Para evitar recursividad infinita
    if (deep > 5) return String(value)

    try {
      JSON.stringify(value)
      return value
    } catch (error) {
      if (Array.isArray(value)) {
        return value.map((item) =>
          LoggerService.cleanAxiosResponse(item, deep + 1)
        )
      }
      if (LoggerService.isAxiosResponse(value)) {
        return {
          data: value.response.data,
          status: value.response.status,
          statusText: value.response.statusText,
          headers: value.response.headers,
          config: value.response.config,
        }
      }
      if (typeof value === 'object') {
        return Object.keys(value).reduce((prev, curr) => {
          prev[curr] = LoggerService.cleanAxiosResponse(value[curr], deep + 1)
          return prev
        }, {} as any)
      }
      try {
        return toJSON(value)
      } catch (e) {
        return [e.toString()]
      }
    }
  }

  private static isAxiosResponse(data: any) {
    return Boolean(
      typeof data === 'object' &&
        data.response &&
        typeof data.response.data !== 'undefined' &&
        typeof data.response.status !== 'undefined' &&
        typeof data.response.statusText !== 'undefined' &&
        typeof data.response.headers !== 'undefined' &&
        typeof data.response.config !== 'undefined'
    )
  }

  private print(level: LOG_LEVEL, ...optionalParams: unknown[]) {
    try {
      const context = this.getContext()

      // CLEAN PARAMS
      optionalParams = optionalParams.map((data: any) =>
        LoggerService.cleanAxiosResponse(data)
      )

      if (LoggerConfig.logLevelSelected.includes(level)) {
        optionalParams.map((param) => {
          if (LoggerService._pinoInstance) {
            LoggerService._pinoInstance[level]({ msg: param, context })
          }
        })
      }
      if (process.env.NODE_ENV === 'production') {
        return
      }

      const color = this.getColor(level)
      const time = dayjs().format('DD/MM/YYYY HH:mm:ss')
      const cTime = `${COLOR.RESET}[${time}]${COLOR.RESET}`
      const cLevel = `${color}${level.toUpperCase()}${COLOR.RESET}`
      const cContext = `${COLOR.RESET}(${context}):${COLOR.RESET}`

      process.stdout.write('\n')
      process.stdout.write(`${cTime} ${cLevel} ${cContext} ${color}`)
      optionalParams.map((data) => {
        try {
          if (data && data instanceof AxiosError) {
            data = data.toJSON()
          }
          data =
            data && typeof data === 'object' && !(data instanceof Error)
              ? JSON.parse(this.redact(JSON.parse(JSON.stringify(data))))
              : data
        } catch (err) {
          //
        }
        const toPrint =
          typeof data === 'object'
            ? inspect(data, false, null, false)
            : String(data)
        console.log(`${color}${toPrint.replace(/\n/g, `\n${color}`)}`)
      })
      process.stdout.write(COLOR.RESET)
    } catch (e) {
      console.error(e)
    }
  }

  private getColor(level: LOG_LEVEL) {
    return LOG_COLOR[level]
  }
}
