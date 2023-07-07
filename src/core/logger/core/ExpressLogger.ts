import { LoggerService } from './LoggerService'
import { expressMiddleware } from 'cls-rtracer'
import { LoggerParams } from '../types'
import { Express } from 'express'

export class ExpressLogger {
  static initialize(app: Express, options: Partial<LoggerParams> = {}) {
    LoggerService.initialize(options)
    app.use(expressMiddleware())

    const pinoInstance = LoggerService.getPinoInstance()
    if (!pinoInstance) throw new Error('LoggerService no ha sido inicializado')

    app.use(pinoInstance)
  }

  static getInstance() {
    return LoggerService.getInstance()
  }
}
