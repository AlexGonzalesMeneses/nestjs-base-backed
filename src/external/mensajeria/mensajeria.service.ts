import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class MensajeriaService {
  constructor(private httpService: HttpService) {}

  /**
   * Metodo para enviar sms
   * @param cellphone Numero de celular
   * @param content contenido
   */
  async sendSms(
    cellphone: string,
    content: string,
  ): Promise<Observable<AxiosResponse<any>>> {
    const smsBody = {
      para: [cellphone],
      contenido: content,
    };

    return this.httpService.post('/correo', smsBody).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new HttpException(error.response.data, error.response.status);
      }),
    );
  }

  /**
   * Metodo para enviar sms
   * @param email Correo Electronico
   * @param subject asunto
   * @param content contenido
   */
  async sendEmail(
    email: string,
    subject: string,
    content: string,
  ): Promise<Observable<AxiosResponse<any>>> {
    const emailBody = {
      para: [email],
      asunto: subject,
      contenido: content,
    };

    return this.httpService.post('/correo', emailBody).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new HttpException(error.response.data, error.response.status);
      }),
    );
  }

  /**
   * Metodo para obtener el estado de un sms enviado
   * @param id Identificador de solicitud sms
   */
  async getReportSms(id: string): Promise<Observable<AxiosResponse<any>>> {
    return this.httpService.get(`/sms/reporte/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new HttpException(error.response.data, error.response.status);
      }),
    );
  }

  /**
   * Metodo para obtener el estado de un correo enviado
   * @param id Identificador de solicitud correo
   */
  async getReportEmail(id: string): Promise<Observable<AxiosResponse<any>>> {
    return this.httpService.get(`/correo/reporte/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new HttpException(error.response.data, error.response.status);
      }),
    );
  }
}
