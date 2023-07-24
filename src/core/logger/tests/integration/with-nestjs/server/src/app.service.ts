import { Injectable, NotFoundException } from '@nestjs/common'
import { ERROR_CODE } from '../../../../../../logger'
import * as throws from './throws'

@Injectable()
export class AppService {
  getEstado(): string {
    return 'Servicio activo'
  }

  getNotFound(): void {
    throw new NotFoundException()
  }

  async getTimeout(): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 999999999)
    })
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
  }
}
