import { BadRequestException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityBadRequestException extends BaseException {
  constructor(mensaje: string)
  constructor(options?: EntityExceptionOptions)
  constructor(arg1?: string | EntityExceptionOptions) {
    super(
      new BadRequestException(),
      typeof arg1 === 'string' ? { mensaje: arg1 } : arg1
    )
  }
}
