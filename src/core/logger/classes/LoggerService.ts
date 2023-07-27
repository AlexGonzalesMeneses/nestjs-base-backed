import dayjs from 'dayjs'
import { Level, pino } from 'pino'
import pinoHttp, { HttpLogger, Options } from 'pino-http'
import { COLOR, DEFAULT_PARAMS, LOG_COLOR, LOG_LEVEL } from '../constants'
import fastRedact, { RedactOptions } from 'fast-redact'
import { LoggerConfig } from './LoggerConfig'
import {
  BaseExceptionOptions,
  BaseLogOptions,
  Metadata,
  LoggerOptions,
  LoggerParams,
} from '../types'
import * as rTracer from 'cls-rtracer'
import { printLoggerParams, stdoutWrite } from '../tools'
import { getContext } from '../utilities'
import { BaseException } from './BaseException'
import { BaseLog } from './BaseLog'

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

  fatal(error: unknown): void
  fatal(error: unknown, mensaje: string): void
  fatal(error: unknown, mensaje: string, metadata: Metadata): void
  fatal(
    error: unknown,
    mensaje: string,
    metadata: Metadata,
    modulo: string
  ): void
  fatal(error: unknown, opt: BaseExceptionOptions & BaseLogOptions): void
  fatal(...args: unknown[]): void {
    const exceptInfo = LoggerService.buildException(LOG_LEVEL.FATAL, ...args)
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
  error(error: unknown, opt: BaseExceptionOptions & BaseLogOptions): void
  error(...args: unknown[]): void {
    const exceptInfo = LoggerService.buildException(LOG_LEVEL.ERROR, ...args)
    this.print(exceptInfo)
  }

  warn(mensaje: string): void
  warn(mensaje: string, metadata: Metadata): void
  warn(mensaje: string, metadata: Metadata, modulo: string): void
  warn(opt: BaseExceptionOptions & BaseLogOptions): void
  warn(...args: unknown[]): void {
    const exceptInfo = LoggerService.buildException(
      LOG_LEVEL.WARN,
      null,
      ...args
    )
    this.print(exceptInfo)
  }

  info(mensaje: string): void
  info(mensaje: string, metadata: Metadata): void
  info(mensaje: string, metadata: Metadata, modulo: string): void
  info(opt: BaseLogOptions): void
  info(...args: unknown[]): void {
    const logInfo = LoggerService.buildLog(LOG_LEVEL.INFO, ...args)
    this.print(logInfo)
  }

  debug(mensaje: string): void
  debug(mensaje: string, metadata: Metadata): void
  debug(mensaje: string, metadata: Metadata, modulo: string): void
  debug(opt: BaseLogOptions): void
  debug(...args: unknown[]): void {
    const logInfo = LoggerService.buildLog(LOG_LEVEL.DEBUG, ...args)
    this.print(logInfo)
  }

  trace(mensaje: string): void
  trace(mensaje: string, metadata: Metadata): void
  trace(mensaje: string, metadata: Metadata, modulo: string): void
  trace(opt: BaseLogOptions): void
  trace(...args: unknown[]): void {
    const logInfo = LoggerService.buildLog(LOG_LEVEL.TRACE, ...args)
    this.print(logInfo)
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

  private static buildLog(lvl: LOG_LEVEL, ...args: unknown[]): BaseLog {
    // 1ra forma - (mensaje: string) => BaseLog
    if (arguments.length === 2 && typeof args[0] === 'string') {
      return new BaseLog({
        mensaje: args[0],
        level: lvl,
      })
    }

    // 2da forma - (mensaje: string, metadata: Metadata) => BaseLog
    else if (arguments.length === 3 && typeof args[0] === 'string') {
      return new BaseLog({
        mensaje: args[0],
        metadata: args[1] as Metadata,
        level: lvl,
      })
    }

    // 3ra forma - (mensaje: string, metadata: Metadata, modulo: string) => BaseLog
    else if (
      arguments.length === 4 &&
      typeof args[0] === 'string' &&
      typeof args[2] === 'string'
    ) {
      return new BaseLog({
        mensaje: args[0],
        metadata: args[1] as Metadata,
        modulo: args[2],
        level: lvl,
      })
    }

    // 4ta forma - (opt: BaseLogOptions) => BaseLog
    else {
      return new BaseLog({
        ...(args[0] as BaseLogOptions),
        level: lvl,
      })
    }
  }

  private print(info: BaseLog | BaseException) {
    try {
      const level = info.getLevel()

      const levelSelected = LoggerService.loggerParams?._levels || []
      if (!levelSelected.includes(level as pino.Level)) {
        return
      }

      const reqId = String(rTracer.id() || '') || ''
      const caller = getContext()
      const msg = info.toString()

      const logFields = {
        reqId: reqId,
        caller: caller,
        fecha: info.fecha,
        levelText: info.level,
        appName: info.appName,
        modulo: info.modulo,
        mensaje: info.obtenerMensajeCliente(),
      }

      let errorFields = {}
      if (info instanceof BaseException) {
        errorFields = {
          httpStatus: info.httpStatus,
          codigo: info.codigo,
          causa: info.causa,
          origen: info.origen,
          accion: info.accion,
          error: info.error,
          formato: msg,
          errorStack: info.errorStackOriginal,
          traceStack: info.traceStack,
        }
      }

      const args = { ...logFields, ...errorFields }
      if (info.metadata && Object.keys(info.metadata).length > 0) {
        Object.assign(args, { metadata: info.metadata })
      }

      // SAVE WITH PINO
      this.saveWithPino(level, args)

      if (process.env.NODE_ENV === 'production') {
        return
      }

      // PRINT TO CONSOLE
      this.printToConsole(level, msg, caller)
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

  private printToConsole(level: LOG_LEVEL, msg: string, caller: string): void {
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
