import { LoggerService } from './../../core/logger/logger.service'

export class BaseService {
  constructor(protected logger: LoggerService, context: string) {
    logger.setContext(context)
  }
}
