import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { LoggerService } from '../../core/logger'

const logger = LoggerService.getInstance()
const threshold = 30 // Tiempo límite en segundos

@Injectable()
export class RequestTimeoutMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const t1 = Date.now()
    let completado = false

    const method = req.method
    const url = req.originalUrl.split('?')[0]

    if (req.method.toLowerCase() === 'options') return next()
    logger.trace(`${req.method} ${req.originalUrl.split('?')[0]}`)

    setTimeout(() => {
      if (!completado) {
        const partialTime = (Date.now() - t1) / 1000
        const msg = `${method} ${url} está demorando (tiempo transcurrido: ${partialTime} seg)`
        logger.warn(msg)
        setTimeout(() => {
          const partialTime = (Date.now() - t1) / 1000
          const msg = `${method} ${url} está demorando demasiado (tiempo transcurrido: ${partialTime} seg)`
          logger.error(msg)
        }, threshold * 1000 * 5)
      }
    }, threshold * 1000)

    res.on('finish', () => {
      completado = true
      const t2 = Date.now()
      const statusCode = res.statusCode
      const statusText = res.statusMessage
      const elapsedTime = (t2 - t1) / 1000
      const msg = `${method} ${url} ${statusCode} ${statusText} (${elapsedTime} seg)`
      const logLevel = RequestTimeoutMiddleware.getLogLevel(statusCode)
      logger[logLevel](msg)
    })

    next()
  }

  private static getLogLevel(statusCode: number) {
    if (statusCode >= 200 && statusCode < 400) return 'trace'
    if (statusCode >= 400 && statusCode < 500) return 'warn'
    if (statusCode >= 500) return 'error'
    return 'info'
  }
}
