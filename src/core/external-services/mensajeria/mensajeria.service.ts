import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class MensajeriaService {
  constructor(private httpService: HttpService) {}

  /**
   * Metodo para enviar sms
   * @param cellphone Numero de celular
   * @param content contenido
   */
  async sendSms(cellphone: string, content: string) {
    const smsBody = {
      para: [cellphone],
      contenido: content,
    };
    try {
      const { data: response } = await this.httpService
        .post('/correo', smsBody)
        .toPromise();
      return response;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error(error.request);
      } else {
        throw new Error(error.message);
      }
    }
  }

  /**
   * Metodo para enviar correo
   * @param email Correo Electronico
   * @param subject asunto
   * @param content contenido
   */
  async sendEmail(email: string, subject: string, content: string) {
    const emailBody = {
      para: [email],
      asunto: subject,
      contenido: content,
    };

    const response = this.httpService
      .post('/correo', emailBody)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .toPromise();
    return response;
  }

  /**
   * Metodo para obtener el estado de un sms enviado
   * @param id Identificador de solicitud sms
   */
  async getReportSms(id: string) {
    const response = this.httpService
      .get(`/sms/reporte/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .toPromise();
    return response;
  }

  /**
   * Metodo para obtener el estado de un correo enviado
   * @param id Identificador de solicitud correo
   */
  async getReportEmail(id: string) {
    const response = this.httpService
      .get(`/correo/reporte/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .toPromise();
    return response;
  }
}
