import { BaseException } from '../../common/exception-manager'
import { HandleErrorOptions } from '../exception-manager/types'

export class ExternalServiceException extends BaseException {
  constructor(error: unknown, errorHandler: string, opt: HandleErrorOptions) {
    super(error, errorHandler, opt)
  }
}
