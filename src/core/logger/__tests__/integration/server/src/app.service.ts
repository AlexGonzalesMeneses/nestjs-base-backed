import { Injectable, NotFoundException } from '@nestjs/common'
import { ERROR_CODE } from '../../../..'
import * as throws from './throws'

@Injectable()
export class AppService {
  getEstado(): string {
    return 'Servicio activo'
  }

  getNotFound(): void {
    throw new NotFoundException()
  }

  async lanzarExcepcion(codigo: string, query: { [key: string]: string }) {
    if (codigo === ERROR_CODE.UNKNOWN_ERROR) {
      throws.UNKNOWN_ERROR()
    }
    if (codigo === ERROR_CODE.EMPTY_ERROR) {
      throws.EMPTY_ERROR()
    }
    if (codigo === ERROR_CODE.STRING_ERROR) {
      throws.STRING_ERROR()
    }
    if (codigo === ERROR_CODE.SERVER_CONEXION) {
      if (query.variant === 'axios') {
        await throws.SERVER_CONEXION_AXIOS()
      }
      if (query.variant === 'fetch') {
        await throws.SERVER_CONEXION_FETCH()
      }
      if (query.variant === 'http') {
        await throws.SERVER_CONEXION_HTTP()
      }
    }
    if (codigo === ERROR_CODE.SERVER_ERROR_1) {
      await throws.SERVER_ERROR_1()
    }
    if (codigo === ERROR_CODE.SERVER_ERROR_2) {
      await throws.SERVER_ERROR_2()
    }
    if (codigo === ERROR_CODE.SERVER_TIMEOUT) {
      return await throws.SERVER_TIMEOUT()
    }
    if (codigo === ERROR_CODE.SERVER_CERT_EXPIRED) {
      return await throws.SERVER_CERT_EXPIRED()
    }
    if (codigo === ERROR_CODE.HTTP_EXCEPTION) {
      if (query.variant === '400') {
        await throws.HTTP_EXCEPTION_400()
      }
      if (query.variant === 'E400') {
        await throws.ENTITY_EXCEPTION_400()
      }
      if (query.variant === '401') {
        await throws.HTTP_EXCEPTION_401()
      }
      if (query.variant === '403') {
        await throws.HTTP_EXCEPTION_403()
      }
      if (query.variant === '404') {
        await throws.HTTP_EXCEPTION_404()
      }
      if (query.variant === '408') {
        await throws.HTTP_EXCEPTION_408()
      }
      if (query.variant === '412') {
        await throws.HTTP_EXCEPTION_412()
      }
      if (query.variant === '500') {
        await throws.HTTP_EXCEPTION_500()
      }
    }
    if (codigo === ERROR_CODE.AXIOS_ERROR) {
      await throws.AXIOS_ERROR()
    }
    if (codigo === ERROR_CODE.SQL_ERROR) {
      await throws.SQL_ERROR()
    }
  }
}
