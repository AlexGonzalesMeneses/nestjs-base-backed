import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { firstValueFrom } from 'rxjs'
import { BaseService } from './base-service'
import { ErrorInfo, ExceptionManager } from '../exception-manager'

export type RequestResult = {
  response: AxiosResponse | null
  config: AxiosRequestConfig
  error?: unknown
  errorMessage?: string
}

export class BaseExternalService extends BaseService {
  constructor(protected http: HttpService) {
    super()
  }

  async request(axiosConfig: AxiosRequestConfig): Promise<RequestResult> {
    const method = axiosConfig.method?.padEnd(6, ' ')
    let t2 = 0,
      elapsedTime: number,
      msg: string

    let errorInfo: ErrorInfo | null = null

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
      errorInfo = ExceptionManager.handleError({ error })
      errorInfo.request = {
        method: axiosConfig.method,
        originalUrl: `${axiosConfig.baseURL || ''}${axiosConfig.url}`,
        headers: axiosConfig.headers,
        params: axiosConfig.params,
        body: axiosConfig.data,
      }
      requestInfo.response =
        error && typeof error === 'object' && 'response' in error
          ? (error.response as AxiosResponse)
          : null
      requestInfo.errorMessage =
        'Ocurrió un error al consultar un servicio externo'
      requestInfo.error = error
    } finally {
      elapsedTime = (t2 - t1) / 1000
      const statusCode = requestInfo.response?.status || 0
      const statusText = requestInfo.response?.statusText || '-'
      msg = `[Servicio externo] ${method} ${axiosConfig.url} ${statusCode} ${statusText} (${elapsedTime} seg)`

      if (errorInfo) {
        errorInfo.response = {
          finalizado: false,
          codigo: statusCode,
          timestamp: Date.now(),
          mensaje: msg,
          datos: requestInfo.response?.data,
        }
      }

      this.logger.trace({
        axiosConfig,
        responseData: requestInfo.response?.data,
        errorInfo,
      })
    }

    return requestInfo
  }
}
