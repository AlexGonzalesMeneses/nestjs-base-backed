import { GenReqId, Options, ReqId } from 'pino-http'
import * as rTracer from 'cls-rtracer'
import pino, { multistream } from 'pino'
import { createStream, Options as RotateOptions } from 'rotating-file-stream'
import path from 'path'
import { LoggerParams } from '../types'
import { LokiOptions } from 'pino-loki'
import { DEFAULT_SENSITIVE_PARAMS } from '../constants'

export class LoggerConfig {
  static getStream(loggerParams: LoggerParams): pino.MultiStreamRes {
    const streamDisk: pino.StreamEntry[] = []
    if (loggerParams.fileParams) {
      const options: RotateOptions = {
        size: loggerParams.fileParams.size,
        path: path.resolve(loggerParams.fileParams.path, loggerParams.appName),
        interval: loggerParams.fileParams.rotateInterval,
      }

      if (
        loggerParams.fileParams.compress &&
        loggerParams.fileParams.compress === 'true'
      ) {
        options.compress = true
      }
      for (const level of loggerParams._levels) {
        const stream = createStream(`${level}.log`, options)
        stream.on('error', (e) => {
          if (!e.message.includes('no such file or directory, rename')) {
            console.error('Error con el rotado de logs', e)
          }
        })
        streamDisk.push({
          stream,
          level,
        })
      }
    }

    const lokiStream: pino.StreamEntry[] = []
    if (loggerParams.lokiParams) {
      lokiStream.push({
        level: 'trace',
        stream: pino.transport<LokiOptions>({
          target: 'pino-loki',
          options: {
            batching:
              typeof loggerParams.lokiParams.batching !== 'undefined' &&
              loggerParams.lokiParams.batching === 'true',
            interval: Number(loggerParams.lokiParams.batchInterval),
            labels: { application: loggerParams.appName },
            host: loggerParams.lokiParams.url,
            basicAuth:
              loggerParams.lokiParams.username &&
              loggerParams.lokiParams.password
                ? {
                    username: loggerParams.lokiParams.username,
                    password: loggerParams.lokiParams.password,
                  }
                : undefined,
          },
        }),
      })
    }

    return multistream([...streamDisk, ...lokiStream])
  }

  static redactOptions(loggerParams: LoggerParams) {
    const customPaths = loggerParams.hide ? loggerParams.hide.split(' ') : []
    return {
      paths: customPaths.concat(DEFAULT_SENSITIVE_PARAMS),
      censor: '*****',
    }
  }

  private static genReqId: GenReqId = () => {
    return rTracer.id() as ReqId
  }

  static getPinoHttpConfig(loggerParams: LoggerParams): Options {
    return {
      genReqId: LoggerConfig.genReqId,
      level: 'trace',
      redact: LoggerConfig.redactOptions(loggerParams),
      autoLogging: false,
      serializers: {
        err: () => {
          return
        },
        req: () => {
          return
        },
        res: () => {
          return
        },
      },
      base: null,
    }
  }
}
