import { UnauthorizedException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityUnauthorizedException extends BaseException {
  constructor(options?: EntityExceptionOptions) {
    super(new UnauthorizedException(), options)
  }
}
