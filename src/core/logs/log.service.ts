import { Injectable } from '@nestjs/common';
import { id } from 'cls-rtracer';
import * as fs from 'fs';

@Injectable()
export class LogService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // constructor() { }
  static getStream() {
    const streams = [
      { stream: process.stdout },
      { stream: fs.createWriteStream('/tmp/info.stream.out') },
      { level: 'debug', stream: fs.createWriteStream('/tmp/debug.stream.out') },
      { level: 'fatal', stream: fs.createWriteStream('/tmp/fatal.stream.out') },
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
        req(req) {
          req.body = req.raw.body;
          return req;
        },
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
          return `Request completed - ${res.statusMessage}`;
        } else if (res.err) {
          return `Request errored with - ${res.err.name} : reason:${res.err.message}`;
        }
      },
      customAttributeKeys: {
        req: `request`,
        res: `response`,
        err: `error`,
        responseTime: `timeTakenForCompletion:ms`,
      },
      prettyPrint: process.env.NODE_ENV !== 'production',
    };
  }
}
