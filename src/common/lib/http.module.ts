import { ResponseTotalRowsDto } from '../dto/response-total-rows.dto';

export const responseTotalRows = function (data): ResponseTotalRowsDto {
  return { total: data[1], rows: data[0] };
};
