import { NotFoundException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityNotFoundException extends BaseException {
  constructor(mensaje: string)
  constructor(options?: EntityExceptionOptions)
  constructor(arg1?: string | EntityExceptionOptions) {
    super(
      new NotFoundException(),
      typeof arg1 === 'string' ? { mensaje: arg1 } : arg1
    )
  }
}
