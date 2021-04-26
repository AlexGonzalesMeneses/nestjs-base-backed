import { Injectable } from '@nestjs/common';
import { id } from 'cls-rtracer';
import * as fs from 'fs';
import pino from 'pino';
import { createWriteStream } from 'pino-http-send';
import { multistream } from 'pino-multi-stream';

@Injectable()
export class LogService {
  static logsLogstashUrl: string = process.env.LOG_URL;
  static logsLogstashToken: string = process.env.LOG_URL_TOKEN;
  static logsFilePath: string = process.env.LOG_PATH;
  static logsEstadarOut: string = process.env.LOG_STD_OUT;

  static sistemName = process.env.npm_package_name || 'APP';

  static getStream() {
    const streamHttp =
      this.logsLogstashUrl.length > 5
        ? [
            createWriteStream({
              url: this.logsLogstashUrl,
              headers: {
                Authorization: this.logsLogstashToken,
              },
            }),
          ]
        : [];

    const StreamDisk =
      this.sistemName.length > 1
        ? [
            {
              stream: fs.createWriteStream(
                `${this.logsFilePath}/${this.sistemName}-out.log`,
              ),
            },
            {
              level: 'error',
              stream: fs.createWriteStream(
                `${this.logsFilePath}/${this.sistemName}-error.log`,
              ),
            },
            {
              level: 'fatal',
              stream: fs.createWriteStream(
                `${this.logsFilePath}/${this.sistemName}-fatal.log`,
              ),
            },
          ]
        : [];

    const streamsEstandar = this.logsEstadarOut
      ? [{ stream: process.stdout }]
      : [];

    // const listaStreamsTotal =streamsEstandar.concat(StreamDisk.concat(streamHttp));

    return multistream();
  }
  static getLoggerConfig() {
    return {
      pinoHttp: this.getPinoHttpConfig(),
    };
  }

  static getPinoHttpConfig() {
    return {
      name: this.sistemName,
      genReqId: (req) => {
        return req.id || id();
      },
      serializers: {
        err: pino.stdSerializers.err,
        req: (req) => {
          req.body = req.raw.body;
          return { id: req.id, method: req.method, url: req.url };
        },
        res: pino.stdSerializers.res,
      },
      redact: {
        paths: (process.env.LOG_HIDE || '').split(' '),
        censor: '*****',
      },
      level: 'info',
      customLogLevel: (res, err) => {
        if (err) {
          if (res.statusCode >= 500) {
            return 'error';
          } else if (res.statusCode > 304 && res.statusCode < 500) {
            return 'warn';
          } else {
            return 'error';
          }
        }
        return 'info';
      },
      customSuccessMessage: (res) => {
        if (res.statusCode <= 304) {
          return `Peticion concluida - ${res.statusCode} ${JSON.stringify(
            res.req.headers,
          )}`;
        }
        return `Peticion concluida - : ${
          res.statusCode
        } Datos de la Peticion: { "headers":"${JSON.stringify(
          res.req.headers,
        )}, "body": ${JSON.stringify(res.req.body)} }`;
      },
      customErrorMessage: function (error, res) {
        return `Peticion concluida - ${
          res.statusCode
        } Datos de la Peticion: { "headers":"${JSON.stringify(
          res.req.headers,
        )}, "body": ${JSON.stringify(res.req.body)} }`;
      },
      customAttributeKeys: {
        req: `request`,
        res: `response`,
        err: `error`,
        responseTime: `Tiempo de la transaccion:ms`,
      },
      prettyPrint: false, //process.env.NODE_ENV !== 'production',
    };
  }
}
