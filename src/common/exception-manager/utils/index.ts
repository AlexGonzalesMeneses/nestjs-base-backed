import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
  PreconditionFailedException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common'
import { HttpMessages } from '../messages'
import { ObjectOrError } from '../types'

export function traducirMensaje(mensaje: string) {
  if (mensaje === 'Forbidden resource') {
    return HttpMessages.EXCEPTION_FORBIDDEN
  }
  return mensaje
}

export function extractMessage(exception: HttpException): string {
  const response = exception.getResponse() as ObjectOrError | string
  if (typeof response === 'string') {
    return traducirMensaje(response)
  }

  if (response.message && response.error) {
    if (typeof response.message === 'string') {
      return traducirMensaje(response.message)
    }

    const unicoMensajeTipoString =
      Array.isArray(response.message) &&
      response.message.length === 1 &&
      typeof response.message[0] === 'string'

    if (unicoMensajeTipoString) {
      return traducirMensaje(response.message[0])
    }
  }

  switch (exception.constructor) {
    case BadRequestException:
      return HttpMessages.EXCEPTION_BAD_REQUEST
    case UnauthorizedException:
      return HttpMessages.EXCEPTION_UNAUTHORIZED
    case NotFoundException:
      return HttpMessages.EXCEPTION_NOT_FOUND
    case PreconditionFailedException:
      return HttpMessages.EXCEPTION_PRECONDITION_FAILED
    case ForbiddenException:
      return HttpMessages.EXCEPTION_FORBIDDEN
    case RequestTimeoutException:
      return HttpMessages.EXCEPTION_REQUEST_TIMEOUT
    default:
      return HttpMessages.EXCEPTION_INTERNAL_SERVER_ERROR
  }
}
