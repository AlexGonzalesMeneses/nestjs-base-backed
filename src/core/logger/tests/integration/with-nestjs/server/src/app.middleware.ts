import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { LoggerService } from '../../../../../../logger'

const logger = LoggerService.getInstance()

@Injectable()
export class AppMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const t1 = Date.now()
    const url = req.originalUrl.split('?')[0]
    const msg = `${req.method} ${url}...`
    logger.trace(msg)

    res.on('finish', () => {
      const t2 = Date.now()
      const statusCode = res.statusCode
      const statusText = res.statusMessage
      const elapsedTime = (t2 - t1) / 1000
      const msg = `${req.method} ${url} ${statusCode} ${statusText} (${elapsedTime} seg)`
      logger.trace(msg, {
        method: req.method,
        url,
        statusCode,
        statusText,
        elapsedTime,
      })
    })

    next()
  }
}
