import {
  ErrorInfo,
  ErrorParams,
  ExceptionManager,
} from '../../../common/exception-manager'
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
import { LogFields } from './LogFields'

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

  fatal(error: unknown): ErrorInfo
  fatal(error: unknown, mensaje: string): ErrorInfo
  fatal(error: unknown, mensaje: string, detalle: unknown[]): ErrorInfo
  fatal(error: unknown, opt: ErrorParams): ErrorInfo
  fatal(
    arg1: unknown,
    arg2?: string | ErrorParams,
    arg3?: unknown[]
  ): ErrorInfo {
    const errorInfo = LoggerService.handleError(arg1, arg2, arg3)
    const optionalParams = errorInfo.toPrint()
    const level = errorInfo.getLogLevel()
    this.print(level, ...optionalParams)
    return errorInfo
  }

  error(error: unknown): ErrorInfo
  error(error: unknown, mensaje: string): ErrorInfo
  error(error: unknown, mensaje: string, detalle: unknown[]): ErrorInfo
  error(error: unknown, opt: ErrorParams): ErrorInfo
  error(
    arg1: unknown,
    arg2?: string | ErrorParams,
    arg3?: unknown[]
  ): ErrorInfo {
    const errorInfo = LoggerService.handleError(arg1, arg2, arg3)
    const optionalParams = errorInfo.toPrint()
    const level = errorInfo.getLogLevel()
    this.print(level, ...optionalParams)
    return errorInfo
  }

  warn(error: unknown): ErrorInfo
  warn(error: unknown, mensaje: string): ErrorInfo
  warn(error: unknown, mensaje: string, detalle: unknown[]): ErrorInfo
  warn(error: unknown, opt: ErrorParams): ErrorInfo
  warn(
    arg1: unknown,
    arg2?: string | ErrorParams,
    arg3?: unknown[]
  ): ErrorInfo {
    const errorInfo = LoggerService.handleError(arg1, arg2, arg3)
    const optionalParams = errorInfo.toPrint()
    const level = errorInfo.getLogLevel()
    this.print(level, ...optionalParams)
    return errorInfo
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

  static handleError(
    arg1: unknown,
    arg2?: string | ErrorParams,
    arg3?: unknown[]
  ): ErrorInfo {
    // 1ra forma - (error: unknown) => ErrorInfo
    if (arguments.length === 1) {
      const error = arg1
      return ExceptionManager.handleError({ error })
    }

    // 2da forma - (error: unknown, mensaje: string) => ErrorInfo
    else if (arguments.length === 2 && typeof arg2 === 'string') {
      return ExceptionManager.handleError({
        error: arg1,
        mensaje: arg2,
      })
    }

    // 3ra forma - (error: unknown, mensaje: string, detalle: unknown[]) => ErrorInfo
    else if (arguments.length === 3 && typeof arg2 === 'string') {
      return ExceptionManager.handleError({
        error: arg1,
        mensaje: arg2,
        detalle: arg3,
      })
    }

    // 4ta forma - (error: unknown, opt: ErrorParams) => ErrorInfo
    else {
      const error = arg1
      const opt = arg2 as ErrorInfo
      return ExceptionManager.handleError({ ...opt, error })
    }
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
      const msg = this.buildMsg(paramsValue)
      const fields = this.findFields(paramsValue)

      // SAVE WITH PINO
      this.saveWithPino(level, msg, reqId, caller, fields)

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
    fieldParam: unknown
  ) {
    const pinoInstance = LoggerService.pinoInstance
    if (!pinoInstance) return

    if (!pinoInstance.logger[level]) return

    const args: object = {
      reqId,
      caller,
      msg,
    }

    if (this.isFieldParam(fieldParam)) {
      Object.assign(args, (fieldParam as LogFields).args)
    }

    pinoInstance.logger[level](args)
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

  private buildMsg(paramsValue: unknown[]) {
    return paramsValue
      .filter((data) => !this.isFieldParam(data))
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

  private findFields(paramsValue: unknown[]): unknown {
    for (const param of paramsValue) {
      if (this.isFieldParam(param)) {
        return param
      }
    }
  }

  private isFieldParam = (param: unknown): boolean => {
    return Boolean(param && typeof param === 'object' && '__FIELD__' in param)
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
