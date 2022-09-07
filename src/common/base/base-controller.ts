import { LoggerService } from '../../core/logger/logger.service'
import { AbstractController } from '../dto/abstract-controller.dto'

export class BaseController extends AbstractController {
  constructor(protected logger: LoggerService, context: string) {
    logger.setContext(context)
    super()
  }
}
