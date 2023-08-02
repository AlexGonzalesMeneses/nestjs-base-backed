import { RequestTimeoutException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityRequestTimeoutException extends BaseException {
  constructor(options?: EntityExceptionOptions) {
    super(new RequestTimeoutException(), options)
  }
}
