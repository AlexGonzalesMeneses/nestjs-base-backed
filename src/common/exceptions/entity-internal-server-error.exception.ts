import { InternalServerErrorException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityInternalServerErrorException extends BaseException {
  constructor(options?: EntityExceptionOptions) {
    super(new InternalServerErrorException(), options)
  }
}
