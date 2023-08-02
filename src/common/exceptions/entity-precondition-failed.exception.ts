import { PreconditionFailedException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityPreconditionFailedException extends BaseException {
  constructor(mensaje: string)
  constructor(options?: EntityExceptionOptions)
  constructor(arg1?: string | EntityExceptionOptions) {
    super(
      new PreconditionFailedException(),
      typeof arg1 === 'string' ? { mensaje: arg1 } : arg1
    )
  }
}
