import dayjs from 'dayjs'
import { Level, pino } from 'pino'
import pinoHttp, { HttpLogger } from 'pino-http'
import { COLOR, DEFAULT_PARAMS, LOG_COLOR, LOG_LEVEL } from '../constants'
import fastRedact, { RedactOptions } from 'fast-redact'
import { LoggerConfig } from './LoggerConfig'
import {
  BaseExceptionOptions,
  Metadata,
  LoggerOptions,
  LoggerParams,
  BaseAuditOptions,
  BaseLogOptions,
  LogOptions,
  AuditOptions,
} from '../types'
import { printLoggerParams, stdoutWrite } from '../tools'
import { getContext } from '../utilities'
import { BaseException } from './BaseException'
import { BaseAudit } from './BaseAudit'
import { BaseLog } from './BaseLog'

export class LoggerService {
  private static loggerParams: LoggerParams | null = null
  private static loggerInstance: LoggerService | null = null

  private static mainPinoInstance: HttpLogger | null = null
  private static auditPinoInstance: HttpLogger | null = null

  static redact: fastRedact.redactFn | null = null

  static initializeWithoutPino(options: LoggerOptions) {
    LoggerService._initialize(options, false)
  }

  static initialize(options: LoggerOptions) {
    LoggerService._initialize(options, true)
  }

  private static _initialize(
    options: LoggerOptions,
    createMainPinoInstance: boolean
  ): void {
    if (LoggerService.mainPinoInstance) return

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

      auditParams: options.auditParams
        ? {
            context:
              typeof options.auditParams.context === 'undefined'
                ? DEFAULT_PARAMS.auditParams?.context || ''
                : options.auditParams.context,
          }
        : DEFAULT_PARAMS.auditParams?.context
        ? {
            context: DEFAULT_PARAMS.auditParams.context,
          }
        : undefined,

      projectPath:
        typeof options.projectPath === 'undefined'
          ? DEFAULT_PARAMS.projectPath
          : options.projectPath,
      _levels: [],
      _audit: [],
    }

    loggerParams._levels = LoggerService.getLevelList(loggerParams.level)
    loggerParams._audit = loggerParams.auditParams?.context.split(' ') || []

    const opts = LoggerConfig.getPinoHttpConfig(loggerParams)
    const stream = LoggerConfig.getMainStream(loggerParams)

    LoggerService.loggerParams = loggerParams
    LoggerService.redact = fastRedact(opts.redact as RedactOptions)

    // CREANDO LA INSTANCIA PRINCIPAL
    if (createMainPinoInstance) {
      LoggerService.mainPinoInstance = pinoHttp(opts, stream)
    }

    // CREANDO LA INSTANCIA PARA AUDIT
    const customLevels = LoggerConfig.getCustomLevels(loggerParams)
    const customLevelsKeys = Object.keys(customLevels)
    const firstLevel =
      customLevelsKeys.length > 0 ? customLevelsKeys[0] : undefined
    const auditOpts = {
      ...opts,
      level: firstLevel,
      useOnlyCustomLevels: true,
      customLevels,
    }
    const auditStream = LoggerConfig.getAuditStream(loggerParams)
    LoggerService.auditPinoInstance = pinoHttp(auditOpts, auditStream)

    printLoggerParams()
  }

  static registerPinoInstance(httpLogger: HttpLogger): void {
    if (LoggerService.mainPinoInstance) return
    LoggerService.mainPinoInstance = httpLogger
  }

  static getInstance(): LoggerService {
    if (LoggerService.loggerInstance) {
      return LoggerService.loggerInstance
    }
    const logger = new LoggerService()
    LoggerService.loggerInstance = logger
    return LoggerService.loggerInstance
  }

  static getPinoInstance(): HttpLogger | null {
    return LoggerService.mainPinoInstance
  }

  static getLoggerParams(): LoggerParams | null {
    return LoggerService.loggerParams
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
  error(error: unknown, opt: LogOptions): void
  error(...args: unknown[]): void {
    const caller = getContext(3)
    const exceptInfo = this.buildException(caller, ...args)
    this.printException(exceptInfo)
  }

  warn(mensaje: string): void
  warn(mensaje: string, metadata: Metadata): void
  warn(mensaje: string, metadata: Metadata, modulo: string): void
  warn(opt: LogOptions): void
  warn(...args: unknown[]): void {
    const logInfo = this.buildLog(LOG_LEVEL.WARN, ...args)
    this.printLog(logInfo)
  }

  info(mensaje: string): void
  info(mensaje: string, metadata: Metadata): void
  info(mensaje: string, metadata: Metadata, modulo: string): void
  info(opt: LogOptions): void
  info(...args: unknown[]): void {
    const logInfo = this.buildLog(LOG_LEVEL.INFO, ...args)
    this.printLog(logInfo)
  }

  debug(mensaje: string): void
  debug(mensaje: string, metadata: Metadata): void
  debug(mensaje: string, metadata: Metadata, modulo: string): void
  debug(opt: LogOptions): void
  debug(...args: unknown[]): void {
    const logInfo = this.buildLog(LOG_LEVEL.DEBUG, ...args)
    this.printLog(logInfo)
  }

  trace(mensaje: string): void
  trace(mensaje: string, metadata: Metadata): void
  trace(mensaje: string, metadata: Metadata, modulo: string): void
  trace(opt: LogOptions): void
  trace(...args: unknown[]): void {
    const logInfo = this.buildLog(LOG_LEVEL.TRACE, ...args)
    this.printLog(logInfo)
  }

  audit(contexto: string, mensaje: string): void
  audit(contexto: string, mensaje: string, metadata: Metadata): void
  audit(contexto: string, opt: AuditOptions): void
  audit(contexto: string, ...args: unknown[]): void {
    const auditInfo = LoggerService.buildAudit(contexto, ...args)
    this.printAudit(auditInfo)
  }

  private buildException(origen: string, ...args: unknown[]): BaseException {
    // 1ra forma - (error: unknown) => BaseException
    if (arguments.length === 1) {
      return new BaseException(args[0], { origen })
    }

    // 2da forma - (error: unknown, mensaje: string) => BaseException
    else if (arguments.length === 2 && typeof args[1] === 'string') {
      return new BaseException(args[0], {
        mensaje: args[1],
        origen,
      })
    }

    // 3ra forma - (error: unknown, mensaje: string, metadata: Metadata) => BaseException
    else if (arguments.length === 3 && typeof args[1] === 'string') {
      return new BaseException(args[0], {
        mensaje: args[1],
        metadata: args[2] as Metadata,
        origen,
      })
    }

    // 4ta forma - (error: unknown, mensaje: string, metadata: Metadata, modulo: string) => BaseException
    else if (
      arguments.length === 4 &&
      typeof args[1] === 'string' &&
      typeof args[3] === 'string'
    ) {
      return new BaseException(args[0], {
        mensaje: args[1],
        metadata: args[2] as Metadata,
        modulo: args[3],
        origen,
      })
    }

    // 5ta forma - (error: unknown, opt: BaseExceptionOptions) => BaseException
    else {
      return new BaseException(args[0], {
        ...(args[1] as BaseExceptionOptions),
        origen,
      })
    }
  }

  private buildLog(
    lvl: LOG_LEVEL.WARN | LOG_LEVEL.INFO | LOG_LEVEL.DEBUG | LOG_LEVEL.TRACE,
    ...args: unknown[]
  ): BaseLog {
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

  private static buildAudit(contexto: string, ...args: unknown[]): BaseAudit {
    // 1ra forma - (contexto: string, mensaje: string) => BaseAudit
    if (arguments.length === 2 && typeof args[0] === 'string') {
      return new BaseAudit({
        contexto,
        mensaje: args[0],
      })
    }

    // 2da forma - (contexto: string, mensaje: string, metadata: Metadata) => BaseAudit
    else if (arguments.length === 3 && typeof args[0] === 'string') {
      return new BaseAudit({
        contexto,
        mensaje: args[0],
        metadata: args[1] as Metadata,
      })
    }

    // 3ra forma - (contexto: string, opt: BaseAuditOptions) => BaseAudit
    else {
      return new BaseAudit({
        ...(args[0] as BaseAuditOptions),
        contexto,
      })
    }
  }

  private printException(info: BaseException) {
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

  private printLog(info: BaseLog) {
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
      const level = info.contexto

      const levelSelected = LoggerService.loggerParams?._audit || []
      if (!levelSelected.includes(level)) {
        return
      }

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
    const instance = LoggerService.mainPinoInstance
    if (instance && instance.logger[level]) {
      instance.logger[level](args)
    }
  }

  private saveAuditWithPino(info: BaseAudit): void {
    const level = info.contexto
    const args = info.getLogEntry()
    const auditInstance = LoggerService.auditPinoInstance
    if (auditInstance) {
      auditInstance.logger[level](args)
    }
  }

  private printToConsole(level: LOG_LEVEL, msg: string, caller: string): void {
    const color = this.getColor(level)
    const time = dayjs().format('HH:mm:ss.SSS')
    const cTime = `${COLOR.LIGHT_GREY}${time}${COLOR.RESET}`
    const cLevel = `${color}[${level.toUpperCase()}]${COLOR.RESET}`
    const cCaller = `${COLOR.RESET}${caller}${COLOR.RESET}`

    stdoutWrite('\n')
    stdoutWrite(`${cTime} ${cLevel} ${cCaller} ${color}`)
    stdoutWrite(`${color}${msg.replace(/\n/g, `\n${color}`)}\n`)
    stdoutWrite(COLOR.RESET)
  }

  private printAuditToConsole(info: BaseAudit): void {
    const metadata = info.metadata || {}
    const msg = info.mensaje ? info.mensaje : ''
    const time = dayjs().format('HH:mm:ss.SSS')
    const cTime = `${COLOR.LIGHT_GREY}${time}${COLOR.RESET}`
    const cLevel = `${COLOR.RESET}[${info.contexto}]${COLOR.RESET}`
    const cMsg = `${COLOR.CYAN}${msg}${COLOR.RESET}`
    const cValues = Object.keys(metadata)
      .filter((key) => typeof metadata[key] !== 'undefined')
      .map(
        (key) =>
          `${COLOR.LIGHT_GREY}${key}=${COLOR.RESET}${String(metadata[key])}`
      )
      .join(' ')

    stdoutWrite('\n')
    stdoutWrite(`${cTime} ${cLevel} ${cMsg} ${cValues}\n`)
    stdoutWrite(COLOR.RESET)
  }

  private getColor(level: LOG_LEVEL): string {
    return LOG_COLOR[level]
  }

  private static getLevelList(logLevel: string): Level[] {
    if (!LOG_LEVEL[logLevel.toUpperCase()]) {
      return []
    }

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
