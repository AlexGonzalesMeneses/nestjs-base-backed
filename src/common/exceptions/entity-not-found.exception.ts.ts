import { NotFoundException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityNotFoundException extends BaseException {
  constructor(options?: EntityExceptionOptions) {
    super(new NotFoundException(), options)
  }
}
