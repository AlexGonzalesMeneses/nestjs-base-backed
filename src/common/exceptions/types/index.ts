import { BaseExceptionOptions } from '../../../core/logger'

export type EntityExceptionOptions = Pick<
  BaseExceptionOptions,
  'mensaje' | 'metadata' | 'modulo' | 'causa' | 'accion'
>
