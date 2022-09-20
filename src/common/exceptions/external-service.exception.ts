import { HttpException, HttpStatus } from '@nestjs/common'

export class ExternalServiceException extends HttpException {
  constructor(service: string, errorMessage: string) {
    const errMsg = `Error con el Servicio Web ${service}: ${errorMessage.toString()}`
    super(errMsg, HttpStatus.PRECONDITION_FAILED)
  }
}
