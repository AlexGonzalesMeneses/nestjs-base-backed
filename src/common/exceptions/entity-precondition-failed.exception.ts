import { PreconditionFailedException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityPreconditionFailedException extends BaseException {
  constructor(options?: EntityExceptionOptions) {
    super(new PreconditionFailedException(), options)
  }
}
