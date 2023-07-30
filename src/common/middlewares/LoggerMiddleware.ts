import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { LoggerService } from '../../core/logger'

const logger = LoggerService.getInstance()

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const t1 = Date.now()
    const url = req.originalUrl.split('?')[0]
    logger.audit({
      contexto: 'request',
      metadata: {
        method: req.method,
        url,
      },
    })

    res.on('finish', () => {
      const t2 = Date.now()
      const statusCode = res.statusCode
      const elapsedTime = (t2 - t1) / 1000
      logger.audit({
        contexto: 'response',
        metadata: {
          method: req.method,
          url,
          code: statusCode,
          time: elapsedTime,
        },
      })
    })

    next()
  }
}
