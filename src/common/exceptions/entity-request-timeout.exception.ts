import { RequestTimeoutException } from '@nestjs/common'
import { BaseException } from '../../core/logger'
import { EntityExceptionOptions } from './types'

export class EntityRequestTimeoutException extends BaseException {
  constructor(mensaje: string)
  constructor(options?: EntityExceptionOptions)
  constructor(arg1?: string | EntityExceptionOptions) {
    super(
      new RequestTimeoutException(),
      typeof arg1 === 'string' ? { mensaje: arg1 } : arg1
    )
  }
}
