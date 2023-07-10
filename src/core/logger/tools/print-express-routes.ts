import { Express } from 'express'
import { _printRoutes } from './print-routes'

export function printExpressRoutes(app: Express) {
  _printRoutes(app)
}
