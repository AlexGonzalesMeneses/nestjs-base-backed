import { BadRequestException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityBadRequestException extends BaseException {
  constructor(options?: EntityExceptionOptions) {
    super(new BadRequestException(), options)
  }
}
