import { ExternalServiceException } from '../../../../common/exceptions'
import { BaseExternalService } from '../../../../common/base'
import { Injectable } from '@nestjs/common'
import { SINCredencialesDTO } from './credenciales.dto'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
import { LoginResponse, LoginResult } from './types'
import { LoggerService } from '../../../logger'

const logger = LoggerService.getInstance()

@Injectable()
export class SinService extends BaseExternalService {
  constructor(protected http: HttpService) {
    super(http)
    logger.trace('Instanciando servicio de SIN...', {
      baseURL: http.axiosRef.defaults.baseURL,
    })
  }

  /**
   * @title Login
   * @description Metodo para verificar si la información de la empresa existe en el servicio del SIN
   */
  async login(datosSIN: SINCredencialesDTO): Promise<LoginResult> {
    try {
      const config: AxiosRequestConfig = {
        url: '/login',
        method: 'post',
        data: {
          nit: datosSIN.Nit,
          usuario: datosSIN.Usuario,
          clave: datosSIN.Contrasena,
        },
      }

      const requestResult = await this.request(config)
      if (requestResult.error && requestResult.errorMessage) {
        return {
          finalizado: false,
          mensaje: requestResult.errorMessage,
        }
      }

      const response = requestResult.response
      const body = response?.data as LoginResponse

      if (
        !body.Estado &&
        body.Mensaje &&
        body.Mensaje.includes('You cannot consume this service')
      ) {
        requestResult.errorMessage = `No tiene permisos para usar este servicio.`
        this.logger.error(requestResult)
        return {
          finalizado: false,
          mensaje: requestResult.errorMessage,
        }
      }

      if (
        !body.Estado &&
        body.Mensaje &&
        body.Mensaje.includes('no API found with those values')
      ) {
        requestResult.errorMessage = `No se encontró el servicio solicitado.`
        this.logger.error(requestResult)
        return {
          finalizado: false,
          mensaje: requestResult.errorMessage,
        }
      }

      if (!body.Autenticado) {
        requestResult.errorMessage =
          body.Mensaje || requestResult.errorMessage || 'Error desconocido'
        this.logger.error(requestResult)
        return {
          finalizado: false,
          mensaje: requestResult.errorMessage,
        }
      }

      return {
        finalizado: true,
        mensaje: body.Estado,
      }
    } catch (error: unknown) {
      const except = new ExternalServiceException(error, SinService.name, {
        mensaje:
          'SIN :: Ocurrió un error de autenticación con el Servicio de Impuestos Nacionales',
      })
      return {
        finalizado: false,
        mensaje: except.errorInfo.obtenerMensajeCliente(),
      }
    }
  }
}
