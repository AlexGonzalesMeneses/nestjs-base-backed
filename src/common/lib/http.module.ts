import { SuccessResponseDto } from '../dto/success-response.dto';
import { TotalRowsResponseDto } from '../dto/total-rows-response.dto';

export const totalRowsResponse = function (data): TotalRowsResponseDto {
  return { total: data[1], rows: data[0] };
};

export const successResponse = function (data, mensaje = 'ok'): SuccessResponseDto {
  return { 
    finalizado: true,
    mensaje,
    datos: data
  };
};
