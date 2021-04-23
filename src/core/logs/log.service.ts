import { Injectable } from '@nestjs/common';
import { id } from 'cls-rtracer';
import * as fs from 'fs';
import pino from 'pino';
import { createWriteStream } from 'pino-http-send';

@Injectable()
export class LogService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // constructor() { }
  static getStream() {
    const streamHttp = createWriteStream({
      url: 'https://dev.iop.agetic.gob.bo/elk/logs',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJqdXhBZjZRM1FqUlZFdHhXclJaRzZmODUwTWRpeUx0VCIsInVzZXIiOiJkZXYtYmFja2VuZC1iYXNlLWxvZ3MiLCJleHAiOjE3MTMwOTk4NDB9.AIzMscSUWxm3TSw2pIVfn7YsejgE_Rv33X_3SRXQmYs',
      },
    });
    const streams = [
      { stream: process.stdout },
      { stream: streamHttp },

      {
        stream: fs.createWriteStream(process.env.LOG_PATH + '/out.log'),
      },
      {
        level: 'error',
        stream: fs.createWriteStream(process.env.LOG_PATH + '/error.log'),
      },
      {
        level: 'fatal',
        stream: fs.createWriteStream(process.env.LOG_PATH + '/fatal.log'),
      },
    ];
    return streams;
  }
  static getLoggerConfig() {
    return {
      pinoHttp: this.getPinoHttpConfig(),
    };
  }

  static getPinoHttpConfig() {
    return {
      name: process.env.npm_package_name || 'APP',
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
          return `Request completed - ${res.req.id} ${JSON.stringify(
            res.req.headers,
          )}`;
        }
        return `Error: ${
          res.statusCode
        } Datos de la Peticion ->>> { "headers":"${JSON.stringify(
          res.req.headers,
        )}, "body": ${JSON.stringify(res.req.body)} }`;
      },
      customErrorMessage: function (error, res) {
        return `Error: ${
          res.statusCode
        } Datos de la Peticion ->>> { "headers":"${JSON.stringify(
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
