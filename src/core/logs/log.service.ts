import { Injectable } from '@nestjs/common'
import * as rTracer from 'cls-rtracer'
import { Options, ReqId } from 'pino-http'
import { createWriteStream } from 'pino-http-send'
import pino, { multistream } from 'pino'
import { IncomingMessage, ServerResponse } from 'http'
import pretty from 'pino-pretty'
import * as rfs from 'rotating-file-stream'
import { Request, Response } from 'express'

@Injectable()
export class LogService {
  static logsLogstashUrl: string = process.env.LOG_URL || ''
  static logsLogstashToken: string = process.env.LOG_URL_TOKEN || ''
  static logsFilePath: string = process.env.LOG_PATH || ''
  static logsEstandarOut: boolean = process.env.LOG_STD_OUT === 'true'
  static sistemName = process.env.npm_package_name || 'APP'

  static getStream(): any {
    // size     = rota por tamaño                G:GigaBytes | M:MegaBytes | K:KiloBytes | B:Bytes
    // interval = rota por intérvalo de tiempo   M:mes | s:semana | d:día | h:hora | m:minuto | s:segundo
    const streamDisk: pino.StreamEntry[] = [
      {
        stream: rfs.createStream('info.log', {
          size: '5M',
          path: LogService.logsFilePath,
          interval: '1d',
        }),
        level: 'info',
      },
      {
        stream: rfs.createStream('error.log', {
          size: '5M',
          path: LogService.logsFilePath,
          interval: '1d',
        }),
        level: 'error',
      },
      {
        stream: rfs.createStream('warn.log', {
          size: '5M',
          path: LogService.logsFilePath,
          interval: '1d',
        }),
        level: 'warn',
      },
    ]

    const streamStandar: pretty.PrettyStream[] = []
    streamStandar.push(
      pretty({
        colorize: true,
        sync: false,
      })
    )

    const streamHttp =
      this.logsLogstashUrl.length > 5
        ? [
            createWriteStream({
              url: this.logsLogstashUrl,
              headers: {
                Authorization: this.logsLogstashToken,
              },
              batchSize: 1,
            }),
          ]
        : []

    return multistream([...streamDisk, ...streamStandar, ...streamHttp])
  }

  static getLoggerConfig() {
    return {
      pinoHttp: this.getPinoHttpConfig(),
    }
  }

  static customSuccessMessage(req: Request, res: Response) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      return `Petición concluida - ${res.statusCode}`
    }

    const codeText = `${res.statusCode}`
    const urlText = `\n${req.method} ${req.originalUrl}`

    const headersText =
      req.headers && Object.keys(req.headers).length > 0
        ? `\nheaders =\n${JSON.stringify(req.headers, null, 2)}`
        : ''

    const bodyText =
      req.body && Object.keys(req.body).length > 0
        ? `\nbody =\n${JSON.stringify(req.body, null, 2)}`
        : ''
    return `Petición concluida - ${codeText}${urlText}${headersText}${bodyText}`
  }

  static customErrorMessage(req: Request, res: Response) {
    const codeText = `${res.statusCode}`
    const urlText = `\n${req.method} ${req.originalUrl}`

    const headersText =
      req.headers && Object.keys(req.headers).length > 0
        ? `\nheaders =\n${JSON.stringify(req.headers, null, 2)}`
        : ''

    const bodyText =
      req.body && Object.keys(req.body).length > 0
        ? `\nbody =\n${JSON.stringify(req.body, null, 2)}`
        : ''
    return `Peticion concluida - ${codeText}${urlText}${headersText}${bodyText}`
  }

  static customLogLevel(req: IncomingMessage, res: ServerResponse, err: Error) {
    if (res.statusCode >= 200 && res.statusCode < 400) return 'info'
    if (res.statusCode >= 400 && res.statusCode < 500) return 'warn'
    if (res.statusCode >= 500) return 'error'
    if (err) return 'error'
    return 'info'
  }

  static getPinoHttpConfig(): Options {
    return {
      name: this.sistemName,
      genReqId: (req) => {
        return (req.id || rTracer.id()) as ReqId
      },
      serializers: {
        err: (err) => {
          return err.type === 'Error' ? undefined : err
        },
        req: (req) => {
          req.body = req.raw.body
          return { id: req.id, method: req.method, url: req.url }
        },
        res: (res) => {
          return { statusCode: res.statusCode }
        },
      },
      formatters: undefined,
      customLogLevel: this.customLogLevel,
      customSuccessMessage: this.customSuccessMessage,
      customErrorMessage: this.customErrorMessage,
      customAttributeKeys: {
        req: `request`,
        res: `response`,
        err: `error`,
        responseTime: `response time [ms]`,
      },
    }
  }
}
