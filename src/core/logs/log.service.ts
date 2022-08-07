import { Injectable } from '@nestjs/common'
import { id } from 'cls-rtracer'
import { Options, ReqId } from 'pino-http'
import { createWriteStream } from 'pino-http-send'
import pino, { multistream } from 'pino'
import { IncomingMessage, ServerResponse } from 'http'
import fsr from 'file-stream-rotator'

@Injectable()
export class LogService {
  static logsLogstashUrl: string = process.env.LOG_URL || ''
  static logsLogstashToken: string = process.env.LOG_URL_TOKEN || ''
  static logsFilePath: string = process.env.LOG_PATH || ''
  static logsEstandarOut: boolean = process.env.LOG_STD_OUT === 'true'

  static sistemName = process.env.npm_package_name || 'APP'

  static getStream() {
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

    const streamDisk =
      this.logsFilePath.length > 2
        ? [
            {
              stream: fsr.getStream({
                filename: `${this.logsFilePath}/${this.sistemName}-out.log`,
                frequency: '1H',
              }),
            },
            {
              level: 'error',

              stream: fsr.getStream({
                filename: `${this.logsFilePath}/${this.sistemName}-error.log`,
                frequency: '1H',
              }),
            },
            {
              level: 'fatal',
              stream: fsr.getStream({
                filename: `${this.logsFilePath}/${this.sistemName}-fatal.log`,
                frequency: '1H',
              }),
            },
          ]
        : []

    const streamsEstandar = this.logsEstandarOut
      ? [{ stream: process.stdout }]
      : []
    return multistream([...streamsEstandar, ...streamDisk, ...streamHttp])
  }

  static getLoggerConfig() {
    return {
      pinoHttp: this.getPinoHttpConfig(),
    }
  }

  static customSuccessMessage(req: IncomingMessage, res: any) {
    if (res.statusCode <= 304) {
      return `Peticion concluida - ${res.statusCode} ${JSON.stringify(
        res.req.headers
      )}`
    }
    return `Peticion concluida - : ${
      res.statusCode
    } Datos de la Peticion: { "headers":"${JSON.stringify(
      res.req.headers
    )}, "body": ${JSON.stringify(res.req.body)} }`
  }

  static customErrorMessage(req: IncomingMessage, res) {
    return `Peticion concluida - ${
      res.statusCode
    } Datos de la Peticion: { "headers":"${JSON.stringify(
      res.req.headers
    )}, "body": ${JSON.stringify(res.req.body)} }`
  }

  static customLogLevel(req: IncomingMessage, res: ServerResponse, err) {
    if (err) {
      if (res.statusCode >= 500) {
        return 'error'
      } else if (res.statusCode > 304 && res.statusCode < 500) {
        return 'warn'
      } else {
        return 'error'
      }
    }
    return 'info'
  }

  static getPinoHttpConfig(): Options {
    return {
      name: this.sistemName,
      genReqId: (req) => {
        return (req.id || id()) as ReqId
      },
      serializers: {
        err: pino.stdSerializers.err,
        req: (req) => {
          req.body = req.raw.body
          return { id: req.id, method: req.method, url: req.url }
        },
        res: pino.stdSerializers.res,
      },
      redact: {
        paths: (process.env.LOG_HIDE || '').split(' '),
        censor: '*****',
      },
      level: 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
      customLogLevel: this.customLogLevel,
      customSuccessMessage: this.customSuccessMessage,
      customErrorMessage: this.customErrorMessage,
      customAttributeKeys: {
        req: `request`,
        res: `response`,
        err: `error`,
        responseTime: `Tiempo de la transaccion:ms`,
      },
      prettyPrint: !(
        this.logsFilePath.length > 2 || this.logsLogstashUrl.length > 5
      ), //false, //process.env.NODE_ENV !== 'production',
      transport: {
        target: 'pino-pretty',
        options: {
          levelFirst: true,
          translateTime: true,
          colorize: true,
        },
      },
    }
  }
}
