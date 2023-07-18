import { ExternalServiceException } from '../../../../common/exceptions'
import { BaseService } from '../../../../common/base'
import { Injectable } from '@nestjs/common'
import { SINCredencialesDTO } from './credenciales.dto'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
import { LoginResponse, LoginResult } from './types'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class SinService extends BaseService {
  constructor(protected http: HttpService) {
    super()
    this.logger.trace('Instanciando servicio de SIN...', {
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

      const response = await firstValueFrom(this.http.request(config))
      const body = response?.data as LoginResponse

      if (
        !body.Estado &&
        body.Mensaje &&
        body.Mensaje.includes('You cannot consume this service')
      ) {
        const exception = new ExternalServiceException({
          error: body.Mensaje,
          modulo: 'SIN',
          mensaje: `No tiene permisos para usar este servicio.`,
          detalle: [{ datosSIN }, { response }],
        })
        this.logger.error(exception)
        return {
          finalizado: false,
          mensaje: exception.errorInfo.obtenerMensajeCliente(),
        }
      }

      if (
        !body.Estado &&
        body.Mensaje &&
        body.Mensaje.includes('no API found with those values')
      ) {
        const error = body.Mensaje
        const mensaje = `No se encontró el servicio solicitado.`
        const detalle = [{ datosSIN }, { response }]
        const err = new ExternalServiceException('SIN', error, mensaje, detalle)
        this.logger.error(err)
        return {
          finalizado: false,
          mensaje,
        }
      }

      if (!body.Autenticado) {
        const error = null
        const mensaje = body.Mensaje || 'Error desconocido'
        const detalle = [{ datosSIN }, { response }]
        const err = new ExternalServiceException('SIN', error, mensaje, detalle)
        this.logger.error(err)
        return {
          finalizado: false,
          mensaje,
        }
      }

      return {
        finalizado: true,
        mensaje: body.Estado,
      }
    } catch (error) {
      const mensaje = `Ocurrió un error de autenticación con el Servicio de Impuestos Nacionales`
      const detalle = [{ datosSIN }]
      const err = new ExternalServiceException('SIN', error, mensaje, detalle)
      this.logger.error(err)
      return {
        finalizado: false,
        mensaje,
      }
    }
  }
}
