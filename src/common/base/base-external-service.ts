import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { firstValueFrom } from 'rxjs'
import { BaseService } from './base-service'
import { ExternalServiceException } from '../exceptions'

export type RequestResult = {
  response: AxiosResponse | null
  config: AxiosRequestConfig
  error?: unknown
  errorMessage?: string
}

export class BaseExternalService extends BaseService {
  protected name = 'Servicio Externo'

  constructor(protected http: HttpService) {
    super()
  }

  async request(axiosConfig: AxiosRequestConfig): Promise<RequestResult> {
    const method = axiosConfig.method?.padEnd(6, ' ')
    let t2 = 0,
      elapsedTime: number,
      msg: string

    const requestInfo: RequestResult = {
      response: null,
      errorMessage: undefined,
      error: null,
      config: axiosConfig,
    }

    const t1 = Date.now()
    try {
      const response = await firstValueFrom(this.http.request(axiosConfig))
      t2 = Date.now()
      requestInfo.response = response
    } catch (error: unknown) {
      t2 = Date.now()
      const except = new ExternalServiceException(
        error,
        BaseExternalService.name,
        { origen: this.name }
      )
      requestInfo.response =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as AxiosResponse)
          : null
      requestInfo.errorMessage = except.errorInfo.obtenerMensajeCliente()
      requestInfo.error = error
    } finally {
      elapsedTime = (t2 - t1) / 1000
      const statusCode = requestInfo.response?.status || '-'
      const statusText = requestInfo.response?.statusText || '-'
      msg = `[Servicio externo] ${method} ${axiosConfig.url} ${statusCode} ${statusText} (${elapsedTime} seg)`

      this.logger.trace({
        axiosConfig,
        responseData: requestInfo.response?.data,
      })
      this.logger.trace(msg)
    }

    return requestInfo
  }
}
