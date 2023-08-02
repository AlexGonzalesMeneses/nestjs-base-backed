import { InternalServerErrorException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityInternalServerErrorException extends BaseException {
  constructor(mensaje: string)
  constructor(options?: EntityExceptionOptions)
  constructor(arg1?: string | EntityExceptionOptions) {
    super(
      new InternalServerErrorException(),
      typeof arg1 === 'string' ? { mensaje: arg1 } : arg1
    )
  }
}
