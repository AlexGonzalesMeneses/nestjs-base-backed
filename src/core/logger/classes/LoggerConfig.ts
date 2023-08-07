import { GenReqId, Options, ReqId } from 'pino-http'
import * as rTracer from 'cls-rtracer'
import pino, { Level, multistream } from 'pino'
import { createStream, Options as RotateOptions } from 'rotating-file-stream'
import path from 'path'
import { FileParams, LoggerParams } from '../types'
import { LokiOptions } from 'pino-loki'
import { DEFAULT_SENSITIVE_PARAMS, LOG_LEVEL, LOG_NUMBER } from '../constants'

export class LoggerConfig {
  static getMainStream(loggerParams: LoggerParams): pino.MultiStreamRes {
    const streamDisk: pino.StreamEntry[] = loggerParams.fileParams
      ? LoggerConfig.fileStream(
          loggerParams.fileParams,
          loggerParams.appName,
          loggerParams._levels,
          {}
        )
      : []
    const lokiStream = LoggerConfig.lokiStream(loggerParams)
    return multistream([...streamDisk, ...lokiStream])
  }

  static getAuditStream(loggerParams: LoggerParams): pino.MultiStreamRes {
    const streamDisk: pino.StreamEntry[] = loggerParams.fileParams
      ? LoggerConfig.fileStream(
          loggerParams.fileParams,
          loggerParams.appName,
          [],
          LoggerConfig.getCustomLevels(loggerParams)
        )
      : []
    const lokiStream = LoggerConfig.lokiStream(loggerParams)
    return multistream([...streamDisk, ...lokiStream], { dedupe: true })
  }

  static getCustomLevels(loggerParams: LoggerParams) {
    const customLevels: { [key: string]: number } = {}
    loggerParams._audit.forEach((ctx, index) => {
      customLevels[ctx] = index + 100
    })
    return customLevels
  }

  private static fileStream(
    fileParams: FileParams,
    appName: string,
    basicLevels: Level[],
    auditLevels: { [key: string]: number }
  ): pino.StreamEntry[] {
    const streamDisk: pino.StreamEntry[] = []

    const options: RotateOptions = {
      size: fileParams.size,
      path: path.resolve(fileParams.path, appName),
      interval: fileParams.rotateInterval,
    }

    if (fileParams.compress && fileParams.compress === 'true') {
      options.compress = true
    }

    // FOR BASIC LOG
    for (const level of basicLevels) {
      const basicLevel: Level = LOG_LEVEL[level.toUpperCase()]
      if (!basicLevel) continue
      const levelNumber = LOG_NUMBER[level]
      const stream = createStream(
        `${levelNumber}_app_${basicLevel}.log`,
        options
      )
      stream.on('error', (e) => {
        if (!e.message.includes('no such file or directory, rename')) {
          console.error('Error con el rotado de logs', e)
        }
      })
      streamDisk.push({
        stream,
        level: basicLevel,
      })
    }

    // FOR AUDIT LOG
    for (const level of Object.keys(auditLevels)) {
      const levelNumber = auditLevels[level]
      if (!levelNumber) continue
      const stream = createStream(`${levelNumber}_audit_${level}.log`, options)
      stream.on('error', (e) => {
        if (!e.message.includes('no such file or directory, rename')) {
          console.error('Error con el rotado de logs', e)
        }
      })
      streamDisk.push({
        stream,
        level: auditLevels[level] as any,
      })
    }

    return streamDisk
  }

  private static lokiStream(loggerParams: LoggerParams): pino.StreamEntry[] {
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
    return lokiStream
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
