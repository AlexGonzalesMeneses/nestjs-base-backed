import { Injectable } from '@nestjs/common'
import * as rTracer from 'cls-rtracer'
import { Options, ReqId } from 'pino-http'
import { createWriteStream } from 'pino-http-send'
import pino, { multistream } from 'pino'
import { IncomingMessage, ServerResponse } from 'http'
import pretty from 'pino-pretty'
import { createStream, Options as RotateOptions } from 'rotating-file-stream'
import { Request, Response } from 'express'

@Injectable()
export class LogService {
  static getStream(): pino.MultiStreamRes {
    const streamDisk: pino.StreamEntry[] = []
    if (process.env.LOG_PATH) {
      const options: RotateOptions = {
        size: process.env.LOG_SIZE || '5M',
        path: process.env.LOG_PATH || './logs',
        interval: process.env.LOG_INTERVAL || '1d',
      }

      if (process.env.LOG_COMPRESS && process.env.LOG_COMPRESS === 'true') {
        options.compress = true
      }

      streamDisk.push({
        stream: createStream('info.log', options),
        level: 'info',
      })
      streamDisk.push({
        stream: createStream('error.log', options),
        level: 'error',
      })
      streamDisk.push({
        stream: createStream('warn.log', options),
        level: 'warn',
      })
    }

    const streamStandar: pretty.PrettyStream[] = []
    if (process.env.LOG_STD_OUT) {
      streamStandar.push(
        pretty({
          colorize: true,
          sync: false,
        })
      )
    }

    const streamHttp: any[] = []
    if (process.env.LOG_URL && process.env.LOG_URL_TOKEN) {
      streamHttp.push(
        createWriteStream({
          url: process.env.LOG_URL,
          headers: {
            Authorization: process.env.LOG_URL_TOKEN,
          },
          batchSize: 1,
        })
      )
    }

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
      name: process.env.npm_package_name || 'APP',
      genReqId: (req) => {
        return (req.id || rTracer.id()) as ReqId
      },
      serializers: {
        err: (err) => {
          return err.type === 'Error' ? undefined : err
        },
        req: (req) => {
          return {
            id: req.id,
            method: req.method,
            url: req.url,
            body: req.raw.body,
          }
        },
        res: (res) => {
          return { statusCode: res.statusCode }
        },
      },
      formatters: undefined,
      level: 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
      customLogLevel: this.customLogLevel,
      customSuccessMessage: this.customSuccessMessage,
      customErrorMessage: this.customErrorMessage,
      customAttributeKeys: {
        req: `request`,
        res: `response`,
        err: `error`,
        responseTime: `response time [ms]`,
      },
      // level: 'info',
      // timestamp: pino.stdTimeFunctions.isoTime,
    }
  }
}
