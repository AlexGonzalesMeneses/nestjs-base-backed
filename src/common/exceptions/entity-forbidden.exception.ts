import { ForbiddenException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityForbiddenException extends BaseException {
  constructor(options?: EntityExceptionOptions) {
    super(new ForbiddenException(), options)
  }
}
