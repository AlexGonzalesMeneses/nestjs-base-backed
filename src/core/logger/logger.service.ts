import { Scope } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { Logger, Params, PARAMS_PROVIDER_TOKEN, PinoLogger } from 'nestjs-pino'
import { inspect } from 'util'
import { LOG_COLOR, LOG_LEVEL } from './constants'

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  context: string = LoggerService.name

  constructor(
    pinoLogger: PinoLogger,

    @Inject(PARAMS_PROVIDER_TOKEN)
    params: Params
  ) {
    super(pinoLogger, params)
  }

  setContext(context: string) {
    this.logger.setContext(context)
    this.context = context
  }
  /**
   * Mensajes para el modo desarrollo.
   * Estos mensajes solamente serán visibles en la terminal, no se guardarán en los ficheros de logs.
   * @param optionalParams
   */
  log(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.NOTICE, ...optionalParams)
  }

  verbose() {
    // disabled method
  }

  /**
   * Estos mensajes se guardarán en los ficheros de logs
   * @param optionalParams
   */
  info(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.INFO, ...optionalParams)
  }

  /**
   * Estos mensajes se guardarán en los ficheros de logs
   * @param optionalParams
   */
  warn(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.WARN, ...optionalParams)
  }

  /**
   * Estos mensajes se guardarán en los ficheros de logs
   * @param optionalParams
   */
  error(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.ERROR, ...optionalParams)
  }

  /**
   * Mensajes para el modo desarrollo.
   * Estos mensajes solamente serán visibles en la terminal, no se guardarán en los ficheros de logs.
   * @param optionalParams
   */
  debug(...optionalParams: unknown[]) {
    this.print(LOG_LEVEL.DEBUG, ...optionalParams)
  }

  private print(level: LOG_LEVEL, ...optionalParams: unknown[]) {
    try {
      if ([LOG_LEVEL.INFO, LOG_LEVEL.WARN, LOG_LEVEL.ERROR].includes(level)) {
        optionalParams.map((param) => this.logger[level](param))
      }
      if (process.env.NODE_ENV === 'production') return

      const color = this.getColor(level)
      process.stdout.write(`\n${color}[${this.context}:${level}]\n`)
      optionalParams.map((data) => {
        const toPrint =
          typeof data === 'object'
            ? inspect(data, false, null, false)
            : String(data)
        console.log(`${color}${toPrint.replace(/\n/g, `\n${color}`)}`)
      })
      process.stdout.write(LOG_COLOR.RESET)
      process.stdout.write('\n')
    } catch (e) {
      console.error(e)
    }
  }

  private getColor(level: LOG_LEVEL) {
    if (level === LOG_LEVEL.INFO) return LOG_COLOR.INFO
    if (level === LOG_LEVEL.WARN) return LOG_COLOR.WARN
    if (level === LOG_LEVEL.ERROR) return LOG_COLOR.ERROR
    if (level === LOG_LEVEL.DEBUG) return LOG_COLOR.DEBUG
    if (level === LOG_LEVEL.NOTICE) return LOG_COLOR.NOTICE
    return LOG_COLOR.DEBUG
  }
}
