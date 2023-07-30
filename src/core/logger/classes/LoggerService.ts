import dayjs from 'dayjs'
import { Level, pino } from 'pino'
import pinoHttp, { HttpLogger, Options } from 'pino-http'
import { COLOR, DEFAULT_PARAMS, LOG_COLOR, LOG_LEVEL } from '../constants'
import fastRedact, { RedactOptions } from 'fast-redact'
import { LoggerConfig } from './LoggerConfig'
import {
  BaseExceptionOptions,
  Metadata,
  LoggerOptions,
  LoggerParams,
  AuditMetadata,
  BaseAuditOptions,
} from '../types'
import { printLoggerParams, stdoutWrite } from '../tools'
import { getContext } from '../utilities'
import { BaseException } from './BaseException'
import { BaseAudit } from './BaseAudit'

export class LoggerService {
  private static loggerParams: LoggerParams | null = null
  private static instance: LoggerService | null = null
  private static pinoInstance: HttpLogger | null = null
  static redact: fastRedact.redactFn | null = null

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

  logError(error: unknown): void {
    const exceptInfo = new BaseException(error)
    this.print(exceptInfo)
  }

  error(error: unknown): void
  error(error: unknown, mensaje: string): void
  error(error: unknown, mensaje: string, metadata: Metadata): void
  error(
    error: unknown,
    mensaje: string,
    metadata: Metadata,
    modulo: string
  ): void
  error(error: unknown, opt: BaseExceptionOptions): void
  error(...args: unknown[]): void {
    const exceptInfo = LoggerService.buildException(LOG_LEVEL.ERROR, ...args)
    this.print(exceptInfo)
  }

  warn(error: unknown): void
  warn(error: unknown, mensaje: string): void
  warn(error: unknown, mensaje: string, metadata: Metadata): void
  warn(
    error: unknown,
    mensaje: string,
    metadata: Metadata,
    modulo: string
  ): void
  warn(error: unknown, opt: BaseExceptionOptions): void
  warn(...args: unknown[]): void {
    const exceptInfo = LoggerService.buildException(LOG_LEVEL.WARN, ...args)
    this.print(exceptInfo)
  }

  audit(mensaje: string): void
  audit(mensaje: string, metadata: AuditMetadata): void
  audit(opt: BaseAuditOptions): void
  audit(...args: unknown[]): void {
    const auditInfo = LoggerService.buildAudit(...args)
    this.printAudit(auditInfo)
  }

  private static buildException(
    lvl: LOG_LEVEL,
    ...args: unknown[]
  ): BaseException {
    // 1ra forma - (error: unknown) => BaseException
    if (arguments.length === 2) {
      return new BaseException(args[0], { level: lvl })
    }

    // 2da forma - (error: unknown, mensaje: string) => BaseException
    else if (arguments.length === 3 && typeof args[1] === 'string') {
      return new BaseException(args[0], {
        mensaje: args[1],
        level: lvl,
      })
    }

    // 3ra forma - (error: unknown, mensaje: string, metadata: Metadata) => BaseException
    else if (arguments.length === 4 && typeof args[1] === 'string') {
      return new BaseException(args[0], {
        mensaje: args[1],
        metadata: args[2] as Metadata,
        level: lvl,
      })
    }

    // 4ta forma - (error: unknown, mensaje: string, metadata: Metadata, modulo: string) => BaseException
    else if (
      arguments.length === 5 &&
      typeof args[1] === 'string' &&
      typeof args[3] === 'string'
    ) {
      return new BaseException(args[0], {
        mensaje: args[1],
        metadata: args[2] as Metadata,
        modulo: args[3],
        level: lvl,
      })
    }

    // 5ta forma - (error: unknown, opt: BaseExceptionOptions) => BaseException
    else {
      return new BaseException(args[0], {
        ...(args[1] as BaseExceptionOptions),
        level: lvl,
      })
    }
  }

  private static buildAudit(...args: unknown[]): BaseAudit {
    // 1ra forma - (mensaje: string) => BaseException
    if (arguments.length === 1 && typeof args[0] === 'string') {
      return new BaseAudit({
        mensaje: args[0],
      })
    }

    // 2da forma - (mensaje: string, metadata: AuditMetadata) => BaseAudit
    else if (arguments.length === 2 && typeof args[0] === 'string') {
      return new BaseAudit({
        mensaje: args[0],
        metadata: args[1] as AuditMetadata,
      })
    }

    // 3ra forma - (opt: BaseAuditOptions) => BaseAudit
    else {
      return new BaseAudit({
        ...(args[0] as BaseAuditOptions),
      })
    }
  }

  private print(info: BaseException) {
    try {
      const level = info.getLevel()

      const levelSelected = LoggerService.loggerParams?._levels || []
      if (!levelSelected.includes(level as pino.Level)) {
        return
      }

      const logEntry = info.getLogEntry()

      // SAVE WITH PINO
      this.saveWithPino(level, logEntry)

      if (process.env.NODE_ENV === 'production') {
        return
      }

      // PRINT TO CONSOLE
      const msg = info.toString()
      const caller = getContext()
      this.printToConsole(level, msg, caller)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  private printAudit(info: BaseAudit) {
    try {
      // SAVE WITH PINO
      this.saveAuditWithPino(info)

      if (process.env.NODE_ENV === 'production') {
        return
      }

      // PRINT TO CONSOLE
      this.printAuditToConsole(info)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  private saveWithPino(level: LOG_LEVEL, args: { [key: string]: unknown }) {
    const instance = LoggerService.pinoInstance
    if (instance && instance.logger[level]) {
      instance.logger[level](args)
    }
  }

  private saveAuditWithPino(info: BaseAudit): void {
    const level = 'trace'
    const args = info.getLogEntry()
    const instance = LoggerService.pinoInstance
    if (instance && instance.logger[level]) {
      instance.logger[level](args)
    }
  }

  private printToConsole(level: LOG_LEVEL, msg: string, caller: string): void {
    const color = this.getColor(level)
    const time = dayjs().format('HH:mm:ss.SSS')
    const cTime = `${COLOR.RESET}${time}${COLOR.RESET}`
    const cLevel = `${color}[${level.toUpperCase()}]${COLOR.RESET}`
    const cCaller = `${COLOR.RESET}${caller}${COLOR.RESET}`

    stdoutWrite('\n')
    stdoutWrite(`${cTime} ${cLevel} ${cCaller} ${color}`)
    stdoutWrite(`${color}${msg.replace(/\n/g, `\n${color}`)}\n`)
    stdoutWrite(COLOR.RESET)
  }

  private printAuditToConsole(info: BaseAudit): void {
    const metadata = info.metadata || {}
    const msg = info.mensaje
      ? `${COLOR.CYAN}${info.mensaje}${COLOR.RESET} `
      : ''

    const values = Object.keys(metadata).map((key) => {
      return `${COLOR.LIGHT_GREY}${key}=${COLOR.RESET}${String(metadata[key])}${
        COLOR.RESET
      }`
    })

    const extraValues = values.join(' ')
    process.stdout.write(
      `\n${COLOR.LIGHT_GREY}${dayjs().format('HH:mm:ss.SSS')} ${COLOR.RESET}${
        info.contexto
      }${COLOR.RESET} ${msg}${COLOR.LIGHT_GREY}${extraValues}${COLOR.RESET}\n`
    )
  }

  private getColor(level: LOG_LEVEL): string {
    return LOG_COLOR[level]
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
