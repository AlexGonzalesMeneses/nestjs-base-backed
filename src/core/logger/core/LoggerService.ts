import dayjs from 'dayjs'
import { Level, pino } from 'pino'
import pinoHttp, { HttpLogger, Options } from 'pino-http'
import { inspect } from 'util'
import { COLOR, DEFAULT_PARAMS, LOG_COLOR, LOG_LEVEL } from '../constants'
import fastRedact, { RedactOptions } from 'fast-redact'
import { LoggerConfig } from './LoggerConfig'
import { LoggerOptions, LoggerParams } from '../types'
import * as rTracer from 'cls-rtracer'
import { printLoggerParams, stdoutWrite } from '../tools'
import { cleanParamValue, getContext } from '../utilities'

export class LoggerService {
  private static loggerParams: LoggerParams | null = null
  private static instance: LoggerService | null = null
  private static pinoInstance: HttpLogger | null = null
  private static redact: fastRedact.redactFn | null = null

  static initializeWithoutPino(options: LoggerOptions) {
    LoggerService._initialize(options, false)
  }

  static initialize(options: LoggerOptions) {
    LoggerService._initialize(options, true)
  }

  private static _initialize(
    options: LoggerOptions,
    createPinoInstance: boolean
  ): void {
    if (LoggerService.pinoInstance) return
    const loggerParams: LoggerParams = {
      appName:
        typeof options.appName === 'undefined'
          ? DEFAULT_PARAMS.appName
          : options.appName,
      level:
        typeof options.level === 'undefined'
          ? DEFAULT_PARAMS.level
          : options.level,
      hide:
        typeof options.hide === 'undefined'
          ? DEFAULT_PARAMS.hide
          : options.hide,
      fileParams: options.fileParams
        ? {
            path:
              typeof options.fileParams.path === 'undefined'
                ? DEFAULT_PARAMS.fileParams?.path || ''
                : options.fileParams.path,
            size:
              typeof options.fileParams.size === 'undefined'
                ? DEFAULT_PARAMS.fileParams?.size || ''
                : options.fileParams.size,
            rotateInterval:
              typeof options.fileParams.rotateInterval === 'undefined'
                ? DEFAULT_PARAMS.fileParams?.rotateInterval || ''
                : options.fileParams.rotateInterval,
            compress:
              typeof options.fileParams.compress === 'undefined'
                ? DEFAULT_PARAMS.fileParams?.compress || ''
                : options.fileParams.compress,
          }
        : undefined,

      lokiParams: options.lokiParams
        ? {
            url:
              typeof options.lokiParams.url === 'undefined'
                ? DEFAULT_PARAMS.lokiParams?.url || ''
                : options.lokiParams.url,
            username:
              typeof options.lokiParams.username === 'undefined'
                ? DEFAULT_PARAMS.lokiParams?.username || ''
                : options.lokiParams.username,
            password:
              typeof options.lokiParams.password === 'undefined'
                ? DEFAULT_PARAMS.lokiParams?.password || ''
                : options.lokiParams.password,
            batching:
              typeof options.lokiParams.batching === 'undefined'
                ? DEFAULT_PARAMS.lokiParams?.batching || ''
                : options.lokiParams.batching,
            batchInterval:
              typeof options.lokiParams.batchInterval === 'undefined'
                ? DEFAULT_PARAMS.lokiParams?.batchInterval || ''
                : options.lokiParams.batchInterval,
          }
        : undefined,
      projectPath:
        typeof options.projectPath === 'undefined'
          ? DEFAULT_PARAMS.projectPath
          : options.projectPath,
      _levels: [],
    }
    loggerParams._levels = LoggerService.getLevelList(loggerParams.level)

    const opts: Options = LoggerConfig.getPinoHttpConfig(loggerParams)
    const stream: pino.DestinationStream = LoggerConfig.getStream(loggerParams)
    LoggerService.loggerParams = loggerParams
    LoggerService.redact = fastRedact(opts.redact as RedactOptions)
    LoggerService.pinoInstance = createPinoInstance
      ? pinoHttp(opts, stream)
      : null
    printLoggerParams()
  }

  static registerPinoInstance(httpLogger: HttpLogger): void {
    if (LoggerService.pinoInstance) return
    LoggerService.pinoInstance = httpLogger
  }

  static getInstance(): LoggerService {
    if (LoggerService.instance) {
      return LoggerService.instance
    }
    const logger = new LoggerService()
    LoggerService.instance = logger
    return LoggerService.instance
  }

  static getPinoInstance(): HttpLogger | null {
    return LoggerService.pinoInstance
  }

  static getLoggerParams(): LoggerParams | null {
    return LoggerService.loggerParams
  }

  fatal(...optionalParams: unknown[]): void {
    this.print(LOG_LEVEL.FATAL, ...optionalParams)
  }

  error(...optionalParams: unknown[]): void {
    this.print(LOG_LEVEL.ERROR, ...optionalParams)
  }

  warn(...optionalParams: unknown[]): void {
    this.print(LOG_LEVEL.WARN, ...optionalParams)
  }

  info(...optionalParams: unknown[]): void {
    this.print(LOG_LEVEL.INFO, ...optionalParams)
  }

  debug(...optionalParams: unknown[]): void {
    this.print(LOG_LEVEL.DEBUG, ...optionalParams)
  }

  trace(...optionalParams: unknown[]): void {
    this.print(LOG_LEVEL.TRACE, ...optionalParams)
  }

  private print(level: LOG_LEVEL, ...optionalParams: unknown[]) {
    try {
      const levelSelected = LoggerService.loggerParams?._levels || []
      if (!levelSelected.includes(level as pino.Level)) {
        return
      }

      const reqId = String(rTracer.id() || '') || '-'
      const caller = getContext()

      // CLEAN PARAMS
      const paramsValue = cleanParamValue(optionalParams)
      const msg = this.getMsg(paramsValue)
      const origen = this.getOrigen(paramsValue)

      // SAVE WITH PINO
      this.saveWithPino(level, msg, reqId, caller, origen)

      if (process.env.NODE_ENV === 'production') {
        return
      }

      // PRINT TO CONSOLE
      this.printToConsole(level, msg, reqId, caller)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  private saveWithPino(
    level: LOG_LEVEL,
    msg: string,
    reqId: string | null,
    caller: string,
    origen?: string
  ) {
    const pinoInstance = LoggerService.pinoInstance
    if (!pinoInstance) return

    if (!pinoInstance.logger[level]) return

    if (origen) {
      pinoInstance.logger[level]({
        reqId,
        caller,
        msg,
        origen,
      })
    } else {
      pinoInstance.logger[level]({
        reqId,
        caller,
        msg,
      })
    }
  }

  private printToConsole(
    level: LOG_LEVEL,
    msg: string,
    reqId: string | null,
    caller: string
  ): void {
    const color = this.getColor(level)
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
    const cTime = `${COLOR.RESET}${time}${COLOR.RESET}`
    const cLevel = `${color}[${level.toUpperCase()}]${COLOR.RESET}`
    const cCaller = `${COLOR.RESET}${caller}${COLOR.RESET}`

    stdoutWrite('\n')
    stdoutWrite(`${cTime} ${cLevel} ${cCaller} ${color}`)
    stdoutWrite(`${color}${msg.replace(/\n/g, `\n${color}`)}\n`)
    stdoutWrite(COLOR.RESET)
  }

  private getColor(level: LOG_LEVEL): string {
    return LOG_COLOR[level]
  }

  private getMsg(paramsValue: unknown[]) {
    return paramsValue
      .map((data) => {
        try {
          data =
            data && typeof data === 'object' && !(data instanceof Error)
              ? JSON.parse(
                  LoggerService.redact
                    ? LoggerService.redact(JSON.parse(JSON.stringify(data)))
                    : JSON.parse(JSON.stringify(data))
                )
              : data
        } catch (err) {
          // lo intentamos :)
        }
        const toPrint =
          typeof data === 'object'
            ? inspect(data, false, null, false)
            : String(data)
        return toPrint
      })
      .join('\n')
  }

  private getOrigen(paramsValue: unknown[]): string {
    let origen = ''
    paramsValue.find((data) => {
      if (data && typeof data === 'object' && (data as any).origen) {
        origen = (data as any).origen
        return true
      }
      if (data && typeof data === 'string') {
        const index = data.indexOf('─ Origen')
        if (index > -1) {
          origen = data.substring(index + 11)
          return true
        }
      }
      return false
    })
    return origen
  }

  private static getLevelList(logLevel: string): Level[] {
    const levelSelected: Level[] = []
    for (const levelKey of Object.keys(LOG_LEVEL)) {
      const level = LOG_LEVEL[levelKey]
      levelSelected.push(level)
      if (level === logLevel) {
        break
      }
    }
    return levelSelected
  }
}
