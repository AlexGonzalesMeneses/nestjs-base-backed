import { LoggerService } from '../../core/logger/logger.service'

export class BaseService {
  protected logger: LoggerService

  constructor(context: string) {
    this.logger = LoggerService.getInstance(context)
  }
}
